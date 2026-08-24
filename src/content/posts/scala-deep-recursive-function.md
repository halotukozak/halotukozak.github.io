---
title: 'Direct-Style Deep Recursive Functions in Scala 3'
description: 'Kotlin''s DeepRecursiveFunction turns deep recursion into a heap-allocated trampoline while keeping direct-style code, built on suspend functions. This post explains why that works, then builds a Scala 3 macro that gets the same trick with no coroutines, no Project Loom, by rewriting a recursive method into a TailRec state machine at compile time.'
published: 2026-08-23
draft: false
tags: [ 'Scala', 'Scala 3', 'macro', 'metaprogramming', 'compile-time', 'Kotlin', 'coroutines', 'trampoline' ]
toc: true
---

## The Stack Runs Out

Can we get direct-style, stack-safe deep recursion in Scala with no monads, no coroutines, no virtual threads, no effect
algebra? To a point, yes. Let's start from the beginning, with the most ordinary recursive function there is:

```scala 3
def sum(n: Int): Int =
  if n == 0 then 0
  else 1 + sum(n - 1)
```

`sum(1_000)` works fine but `sum(1_000_000)` fails with a `StackOverflowError` and `@tailrec` won't save it, either (the
recursive call isn't in tail position). `1 + sum(n - 1)` has to return from `sum` before the `1 +` can happen, so every
call needs a stack frame to come back to.

The standard fix is an accumulator, moving the running total into a parameter so the recursive call becomes the entire
return value instead of part of an expression:

```scala 3
@tailrec
def sumAcc(n: Int, acc: Int = 0): Int =
  if n == 0 then acc
  else sumAcc(n - 1, acc + n)
```

`sumAcc(1_000_000)` runs fine now. It works because the accumulator carries `sum`'s running total forward one call at a
time, but such a solution doesn't scale. Take tree depth as an example: `max(depth(left), depth(right))`. Here, `left`
and `right` are separate subtrees rather than sequential steps, so a single accumulator cannot carry both branches
forward at the same time. That is the core challenge: we want to keep the clean, intuitive recursive structure
(arbitrary branching included) while eliminating the JVM stack frames that cause overflows. To solve this, we will first
look at how Scala traditionally handles this by manually offloading execution from the call stack to heap memory through
a technique called trampolining. Then, we will explore how Kotlin avoids this manual rewrite altogether, and finally
build a Scala 3 macro that gives us the best of both worlds.

## Trampolines, the Manual Way

Scala's standard library ships an escape hatch for exactly this: `scala.util.control.TailCalls`. We give up direct
recursion and hand-build a trampoline instead, a value that says "call this next" instead of calling it:

```scala 3
import scala.util.control.TailCalls.*

def sumTrampolined(n: Int): TailRec[Int] =
  if n == 0 then done(0)
  else tailcall(sumTrampolined(n - 1)).map(1 + _)

sumTrampolined(1_000_000).result // 1000000, no overflow
```

`done` and `tailcall` build a `TailRec[A]`, a tiny free monad over three cases: `Done`, `Call`, `Cont`. `.result`
drives the computation to completion with a loop that's itself annotated `@tailrec`, so the whole computation runs on
one JVM stack frame no matter how deep the "recursion" goes. It's the textbook trampoline
from ["Stackless Scala with Free Monads"](https://blog.higher-order.com/assets/trampolines.pdf), and it's what Cats
Effect's `IO`, Monix's `Task` and ZIO's runtime all do under the hood too. Trampolining is baked into their run loops,
which is exactly why stack-unsafe recursion inside `flatMap` chains isn't a problem for them.

The price is the same everywhere, though: the code stops looking like the function it computes. Even the library's own
scaladoc example for two-call recursion shows the tax:

```scala 3
def fib(n: Int): TailRec[Int] =
  if n < 2 then done(n)
  else for
    x <- tailcall(fib(n - 1))
    y <- tailcall(fib(n - 2))
  yield x + y
```

Every self-call gets wrapped in `tailcall`, every use of its result moves into a `flatMap`, and the return type stops
being `Int`.

## the Kotlin Approach

Kotlin's standard library has [
`DeepRecursiveFunction`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deep-recursive-function/), and it does
something that looks like it shouldn't be possible: the same stack safety, with none of the rewriting. Swap `depth(...)`
for `callRecursive(...)`, wrap the body in `DeepRecursiveFunction { }`, and a function that would blow the stack
doesn't. The shape of the code doesn't change: `if`, `+`, ordinary calls, no monad, no `flatMap`. It reads exactly like
`fib`:

```kotlin
val fib = DeepRecursiveFunction<Int, Int> { n ->
    if (n < 2) n else callRecursive(n - 1) + callRecursive(n - 2)
}
```

The docs give away the mechanism in one line: it "keeps its stack on the heap." And the `block` parameter's type tells
us how: `suspend DeepRecursiveScope<T, R>.(T) -> R`. It's a coroutine.

## Why It Actually Works

`suspend` is an instruction to the Kotlin compiler: rewrite this function body into continuation-passing style. Every
suspension point becomes a state in a compiler-generated state machine, and each state's local variables get hoisted
into a heap-allocated object instead of living on the JVM stack. That is standard coroutine machinery: it lets execution
pause and release its thread without losing the function's internal state.

DeepRecursiveFunction takes that same machinery and drives it by hand rather than relying on a dispatcher. Roman
Elizarov explains the details
in [his article on deep recursion with coroutines](https://elizarov.medium.com/deep-recursion-with-coroutines-7c53e15993e3),
but the key takeaway is straight to the point: a compiler-driven CPS transform (suspend) paired with a tight driver loop
that turns "call and wait" into simple field mutations. The call stack becomes a chain of heap objects, evaluated by one
method that stays within a fixed JVM stack frame.

## Can Scala Steal This?

Scala 3 has no `suspend`, and no built-in mechanism for rewriting an arbitrary function body into a state machine. And
reaching for Project Loom or virtual threads wouldn't fix this. It's JVM 21+ only, and by design it doesn't buy the
extra depth we'd want. [JEP 444](https://openjdk.org/jeps/444) is explicit that a virtual thread's heap-allocated stacks
"grow and shrink as the application runs, both to be memory-efficient and to accommodate stacks of depth up to the JVM's
configured platform thread stack size". That is up to the same depth an ordinary thread already gets, not past it, and
under G1 it can overflow *earlier*, at half a GC region, which can be as small as 512KB. A virtual thread moves the same
fixed-depth stack onto the heap; it doesn't remove the one frame per call that's the actual problem.

But Scala 3 has something Kotlin's approach doesn't need and doesn't have: macros that see a method's AST at compile
time. If the Kotlin compiler can mechanically turn a `suspend` lambda into a state machine, a macro can mechanically
turn a self-recursive method's body into the `TailRec`-driven one, so the *caller* keeps writing direct-style recursion,
and the trampoline gets generated. The target API looks like this:

```scala 3
def deepFib(n: Int): Int = deepRecursive:
  if n < 2 then n
  else deepFib(n - 1) + deepFib(n - 2)

deepFib(1_000_000) // 1000000, no overflow
```

We want to have it rewritten to the trampolined form automatically, like this:

```scala 3
def deepFib(n: Int): Int =
  def loop(n: Int): TailRec[Int] =
    if n < 2 then done[Int](n)
    else tailcall[Int](loop(n - 1)).flatMap[Int](x =>
      tailcall[Int](loop(n - 2)).flatMap[Int](`x₂` => done[Int](x + `x₂`)))

  loop(n).result
```

Let's build it, one capability at a time.

## Step 1: One Call, Nothing Fancy

Smallest useful target first: a call that *is* the whole branch, nothing wrapped around it:

```scala 3
def deepCountDown(n: Int): Int = deepRecursive:
  if n <= 0 then 0
  else deepCountDown(n - 1)
```

```scala 3
import scala.quoted.*
import scala.util.control.TailCalls.{done, tailcall, TailRec}

inline def deepRecursive[T](inline body: T): T = ${ deepRecursiveImpl[T]('body) }
def deepRecursiveImpl[T](body: Expr[T])(using Quotes, Type[T]): Expr[T] =
  import quotes.reflect.*

  val methSymbol = Symbol.spliceOwner.owner
  val param = methSymbol.paramSymss.flatten.head

  val loopMethod = Symbol.newMethod(
    methSymbol,
    Symbol.freshName("loop"),
    MethodType(List(param.name))(
      _ => List(param.termRef.widen),
      _ => TypeRepr.of[TailRec].appliedTo(TypeRepr.of[T]),
    ),
  )
  val loopParam = loopMethod.paramSymss.flatten.head

  object renameParams extends TreeMap:
    override def transformTerm(t: Term)(owner: Symbol): Term = t match
      case ident: Ident if ident.symbol == param => Ref(loopParam)
      case _ => super.transformTerm(t)(owner)

  def transform(tree: Term): Term = tree match
    case If(cond, thenp, elsep) => If(cond, transform(thenp), transform(elsep))
    case Inlined(call, bindings, expr) => Inlined(call, bindings, transform(expr))
    case Apply(fun, args) if fun.symbol == methSymbol =>
      '{ tailcall(${ Ref(loopMethod).appliedToArgs(args).asExprOf[TailRec[T]] }) }.asTerm
    case other =>
      '{ done[T](${ other.asExprOf[T] }) }.asTerm

  val renamedBody = renameParams.transformTerm(body.asTerm)(loopMethod)
  val loopBody = transform(renamedBody).changeOwner(loopMethod)
  val loopDefDef = DefDef(loopMethod, _ => Some(loopBody))
  val loopCall = Ref(loopMethod).appliedTo(Ref(param)).asExprOf[TailRec[T]]

  Block(List(loopDefDef), '{ $loopCall.result }.asTerm).asExprOf[T]
```

`Symbol.spliceOwner` is the definition the macro is being expanded inside of. Since `deepRecursive` is the *entire body*
of `deepCountDown`, that's `deepCountDown` itself, so `.owner` steps one level out to whatever encloses it. Everything
the macro needs about `deepCountDown` comes straight off that symbol: `methSymbol.paramSymss` is the parameter symbols
themselves, and `param.termRef.widen` recovers `n`'s type from its own reference. The return type needs no lookup at
all: `T` is already sitting there, inferred from `body: Expr[T]` at the call site, and since `deepRecursive` sits in
`deepCountDown`'s whole-body position, `T` *is* `deepCountDown`'s return type.

`Symbol.newMethod` + `MethodType` synthesizes a sibling method with the same parameter and a `TailRec[T]` return type
instead of `T`. Its name comes from `Symbol.freshName("loop")`, not the literal string. The actual generated method is
called something like `loop$macro$1`, unique per expansion, so two `deepRecursive` calls in the same file never collide
even before the JVM gets a chance to mangle local-method names on its own. Every example from here on calls it
`loop` for readability; the real name is longer but never matters, since nothing in the macro ever looks it up by name,
every reference is a direct `Symbol` handle. `transform` walks the body: `If` recurses into both branches,
`Inlined` peels through and keeps going (more on that below), a self-call becomes `tailcall(loop(...))`, and anything
else is a base case, wrapped in `done`.

`Inlined` is crucial, because without it, `deepCountDown` recurses forever, alternating between `deepCountDown` and
`loop`. `body: T` is bound from an `inline body: T` parameter, and an inlined macro argument arrives already wrapped in
an `Inlined` node. Without a case for it, that wrapper doesn't match `If`, so `transform` falls into
`case other`, wraps the *entire untransformed body*, recursive call included, in a single `done(...)`, and that
`done(...)` evaluates the original expression eagerly. `deepCountDown` calls `loop`, `loop` calls `deepCountDown` right
back. The trampoline is a no-op, and the bug stays silent until we run it deep enough to overflow.

```text
at Main$package$.loop$1(Main.scala:3)
at Main$package$.deepCountDown(Main.scala:2)
at Main$package$.loop$1(Main.scala:3)
at Main$package$.deepCountDown(Main.scala:2)
at Main$package$.loop$1(Main.scala:3)
at Main$package$.deepCountDown(Main.scala:2)
... (repeats until StackOverflowError)
```

Failing to rename parameters leads to a subtle bug. `loop`'s parameter is a brand-new symbol, not `deepCountDown`'s, so
without `renameParams`, every `n` inside the body still points at the *original* parameter, which `loop` closes over
instead of reading its own argument. The code type-checks, `deepCountDown(5)` compiles and runs, but never returns,
because `n` never changes and the base case never fires.

With both fixes in, `deepCountDown(1_000_000)` returns `0` instead of blowing the stack. Progress, but only for the
narrowest shape of recursion there is.

## Step 2: A Call Buried Inside an Expression

Functions such as `deepSum` cannot be transformed:

```scala 3
def deepSum(n: Int): Int = deepRecursive:
  if n == 0 then 0
  else 1 + deepSum(n - 1)
```

The `else` branch is `1 + deepSum(n - 1)` which, under the hood, is *also* an `Apply` node, since `+` is a method call.
`case Apply(fun, args) if fun.symbol == methSymbol` no longer matches it: `fun.symbol` here is `Int.+`, not
`deepSum`. Pattern-matching the leaf itself against "is this the call" doesn't scale: the leaf needs to be searched for
a call buried anywhere inside it, and whatever's found needs to be trampolined and its eventual result spliced back into
the original shape.

Expected outcome looks like this:

```scala 3
def deepSum(n: Int): Int =
  def loop(n: Int): TailRec[Int] =
    if n == 0 then done[Int](0)
    else tailcall[Int](loop(n - 1)).flatMap[Int](x => done[Int](1 + x))

  loop(n).result
```

In our implementation, that's three new pieces. A search over the tree:

```scala 3
object selfCallCollector extends TreeAccumulator[List[Apply]]:
  def foldTree(acc: List[Apply], tree: Tree)(owner: Symbol): List[Apply] = tree match
    case app@Apply(fun, _) if fun.symbol == methSymbol => app :: acc
    case _ => foldOverTree(acc, tree)(owner)
```

A substitution that swaps specific call nodes for their eventual results:

```scala 3
def replaceSubtrees(tree: Term, mapping: Seq[(find: Term, replace: Expr[T])]): Expr[T] =
  object replacer extends TreeMap:
    override def transformTerm(t: Term)(owner: Symbol): Term =
      mapping.find(_.find eq t).map(_.replace.asTerm).getOrElse(super.transformTerm(t)(owner))
  replacer.transformTerm(tree)(Symbol.spliceOwner).asExprOf[T]
```

Matching is by reference (`eq`), not structural equality, because two syntactically identical recursive calls at
different positions in the same expression are two distinct occurrences, and only one of them should be replaced by any
given substitution.

And the leaf handler that ties them together, folding a chain of `tailcall(...).flatMap { x => ... }` over however many
calls it found:

```scala 3
def wrapLeaf(tree: Term): Term =
  val calls = selfCallCollector.foldTree(Nil, tree)(Symbol.spliceOwner).reverse

  def buildChain(remaining: List[Apply], bound: Vector[(Term, Expr[T])]): Expr[TailRec[T]] = remaining match
    case Nil => '{ done[T](${ replaceSubtrees(tree, bound) }) }
    case (call@Apply(_, args)) :: rest =>
      '{
        tailcall(${ Ref(loopMethod).appliedToArgs(args).asExprOf[TailRec[T]] }).flatMap { (x: T) =>
          ${ buildChain(rest, bound :+ (call, '{ x })) }
        }
      }

  buildChain(calls, Vector.empty).asTerm
```

`transform` shrinks to two structural cases plus a fallback:

```scala 3
def transform(tree: Term): Term = tree match
  case If(cond, thenp, elsep) => If(cond, transform(thenp), transform(elsep))
  case Inlined(call, bindings, expr) => Inlined(call, bindings, transform(expr))
  case _ => wrapLeaf(tree)
```

`deepSum(1_000_000)` now returns `1000000`. Notice that nothing in our implementation restricts us to a single recursive
call: `buildChain` folds over a`List[Apply]` of whatever length `selfCallCollector` found. Point the exact same macro at
Fibonacci and Tribonacci, with two and three self-calls per branch respectively:

```scala 3
def deepFib(n: Int): Int = deepRecursive:
  if n < 2 then n
  else deepFib(n - 1) + deepFib(n - 2)

def deepTribonacci(n: Int): Long = deepRecursive:
  if n < 2 then n.toLong
  else if n == 2 then 1L
  else deepTribonacci(n - 1) + deepTribonacci(n - 2) + deepTribonacci(n - 3)
```

`deepFib` should expand to:

```scala 3
def deepFib(n: Int): Int =
  def loop(n: Int): TailRec[Int] =
    if n < 2 then done[Int](n)
    else tailcall[Int](loop(n - 1)).flatMap[Int](x =>
      tailcall[Int](loop(n - 2)).flatMap[Int](`x₂` => done[Int](x + `x₂`)))

  loop(n).result
```

That's `buildChain` made visible: the first call's result is bound as `x`, the second call runs *after* it (each
`flatMap` is a real dependency, not parallelism), bound as `x₂`, and only once both are in hand does `replaceSubtrees`
splice them back into `x + x₂`, the original expression shape, with calls swapped for their bound results.

## Step 3: More Shapes of Control Flow

`transform` currently understands exactly two structural forms: `If` and `Inlined`. Two more come up immediately in
practice: a `match`, and a block with a local `val` before the tail expression:

```scala 3
def deepBlockSum(n: Int): Int = deepRecursive:
  if n == 0 then 0
  else
    val prev = n - 1
    1 + deepBlockSum(prev)

def deepCollatzSteps(n: Long): Int = deepRecursive:
  n match
    case 1L => 0
    case x if x % 2 == 0 => 1 + deepCollatzSteps(x / 2)
    case x => 1 + deepCollatzSteps(3 * x + 1)
```

Both are "keep walking until we hit a leaf, then stop" cases, same as `If`:

```scala 3
def transform(tree: Term): Term = tree match
  case If(cond, thenp, elsep) =>
    If(cond, transform(thenp), transform(elsep))
  case Match(scrutinee, cases) =>
    Match(scrutinee, cases.map(c => CaseDef(c.pattern, c.guard, transform(c.rhs))))
  case Block(stats, expr) =>
    Block(stats, transform(expr))
  case Typed(expr, _) =>
    transform(expr)
  case Inlined(call, bindings, expr) =>
    Inlined(call, bindings, transform(expr))
  case _ =>
    wrapLeaf(tree)
```

`Match` only transforms each case's right-hand side (a guard is a condition, not a value the function returns, so it's
copied through untouched). `Block` transforms only its trailing expression; the local `val prev = n - 1` stays exactly
where it is, ahead of the `loop` call it feeds. `Typed` shows up around `if` branches whose two arms have to be widened
to a common type (`0` and `1 + deepBlockSum(prev)` both get typed as `Int`), because it carries no structure of its own,
so it's a pure pass-through.

Both examples run cleanly at a million levels deep, and the local `val` ends up hoisted ahead of the tailcall, not
duplicated or dropped:

```scala 3
def deepBlockSum(n: Int): Int =
  def loop(n: Int): TailRec[Int] =
    if n == 0 then done[Int](0)
    else
      val prev: Int = n - 1
      tailcall[Int](loop(prev)).flatMap[Int](x => done[Int](1 + x))

  loop(n).result
```

## Step 4: More Than One Parameter

Everything so far assumes a single parameter, `param`, threaded through by hand. `deepSumAcc` needs two:

```scala 3
def deepSumAcc(n: Int, acc: Long): Long = deepRecursive:
  if n == 0 then acc
  else deepSumAcc(n - 1, acc + n)
```

The fix is mechanical: `param` becomes `termParams`, a list read the same way, straight off the symbol, and the rename
step becomes a symbol-to-symbol map instead of a single equality check:

```scala 3
val termParams = methSymbol.paramSymss.flatten

val loopMethod = Symbol.newMethod(
  methSymbol,
  Symbol.freshName("loop"),
  MethodType(termParams.map(_.name))(
    _ => termParams.map(_.termRef.widen),
    _ => TypeRepr.of[TailRec].appliedTo(TypeRepr.of[T]),
  ),
)

val paramSubstitution = termParams.zip(loopMethod.paramSymss.flatten).toMap

object renameParams extends TreeMap:
  override def transformTerm(t: Term)(owner: Symbol): Term = t match
    case ident: Ident if paramSubstitution.contains(ident.symbol) =>
      Ref(paramSubstitution(ident.symbol))
    case _ => super.transformTerm(t)(owner)

val loopCall = Ref(loopMethod).appliedToArgs(termParams.map(Ref.apply))
```

`deepSumAcc(100, 0L)` sums `1` to `100` correctly, arbitrarily deep. Point the same code at a generic method:

```scala 3
def deepRepeat[A](n: Int, a: A): A = deepRecursive:
  if n == 0 then a else deepRepeat(n - 1, a)
```

and it breaks:

```text
wrong number of arguments for (A, n: Int, a: A): TailRec[A], expected: 3, found: 2
java.lang.AssertionError: assertion failed: expected a term symbol, but received type A
```

`paramSymss` returns every parameter *clause*, and a type parameter list is one of them. For `deepRepeat[A]`,
`methSymbol.paramSymss` is `List(List(A), List(n, a))`, so `.flatten` folds the type symbol `A` in right alongside the
two term parameters. `loop` ends up with an unintended third parameter for a type, and building a `Ref` to it crashes
outright. Filtering to term symbols fixes it:

```scala 3
val termParams = methSymbol.paramSymss.flatten.filter(_.isTerm)
```

With that, `deepRepeat` compiles and runs unmodified. Nothing in `deepRecursiveImpl` hardcodes a concrete type anywhere:
`param.termRef.widen` and `TypeRepr.of[T]` read `A` straight off the symbols involved, and `loop` is created as a
*nested* method still inside `deepRepeat`'s scope, so a reference to `A` resolves exactly like it does in the original
body. The decompiled bytecode confirms it isn't specialized per call site: `A` erases to `Object`, same as any other
generic method would:

```java
private final TailCalls.TailRec loop$8(int n, Object a) {
    if (n == 0) {
        return TailCalls$.MODULE$.done(a);
    }
    return TailCalls$.MODULE$.tailcall(() -> this.loop$8$$anonfun$1(n, a))
            .flatMap(x -> TailCalls$.MODULE$.done(x));
}
```

## Step 5: using, implicit, and Context Bounds

One shape is still unhandled: a trailing parameter clause.

```scala 3
final case class Bump(amount: Int)

def deepWithBump(n: Int)(using bump: Bump): Int = deepRecursive:
  if n == 0 then 0 else bump.amount + deepWithBump(n - 1)
```

`termParams` already sees `bump`, becasue `paramSymss` returns every parameter clause, `using` included, so `loop` gets
both parameters from the start. Compile `deepWithBump` and the failure is in the self-call, not the definition:

```text
wrong number of arguments for (n: Int, bump: Bump): TailRec[Int], expected: 2, found: 1
Found:    (bump : Bump)
Required: Int
```

`deepWithBump(n - 1)` isn't a single `Apply` once the compiler fills in the `using` argument - it's a curried one,
`Apply(Apply(Ident(deepWithBump), List(n - 1)), List(bump))`. Reading `args` straight off the pattern match,
`case (call @ Apply(_, args))`, only ever sees the outermost clause `List(bump)` and tries to pass it as `loop`'s first,
`Int` parameter. Flattening the call's own argument lists fixes it:

```scala 3
def flattenArgs(tree: Term): List[Term] = tree match
  case Apply(fun, args) => flattenArgs(fun) ::: args
  case _ => Nil
```

and in `buildChain`, the pattern drops `args` entirely in favor of `flattenArgs(call)`:

[//]: # (@formatter:off)
```scala 3
case (call @ Apply(_, _)) :: rest=>
    '{
      tailcall(${ Ref(loopMethod).appliedToArgs(flattenArgs(call)).asExprOf[TailRec[T]] }).flatMap { (x: T) =>
        ${ buildChain(rest, bound :+ (call, '{ x })) }
      }
    }
```
[//]: # (@formatter:on)

`loop` itself stays a single flattened parameter list (`using` only matters for how the *caller* supplies an argument,
not for how `loop` receives it).

```scala 3
def deepWithBump(n: Int)(using bump: Bump): Int =
  def loop(n: Int, bump: Bump): TailRec[Int] =
    if n == 0 then done[Int](0)
    else tailcall[Int](loop(n - 1, bump)).flatMap[Int](x => done[Int](bump.amount + x))

  loop(n, bump).result
```

This one change covers more than `using`: an old-style `implicit` parameter clause desugars to the same curried shape,
and so does a context bound, since `def deepSumWith[A: Numeric](n: Int, a: A): A` is sugar for a synthesized trailing
`using Numeric[A]` clause:

```scala 3
def deepSumWith[A: Numeric](n: Int, a: A): A = deepRecursive:
  if n == 0 then a
  else deepSumWith(n - 1, Numeric[A].plus(a, Numeric[A].one))

def deepImplicitStep(n: Int)(implicit step: Step): Int = deepRecursive:
  if n == 0 then 0 else step.amount + deepImplicitStep(n - 1)
```

Both compile and run against the exact same macro - no further special-casing needed. And with that, this is the
complete implementation:

```scala 3
import scala.annotation.tailrec
import scala.quoted.*
import scala.util.control.TailCalls.{done, tailcall, TailRec}

inline def deepRecursive[T](inline body: T): T = ${ deepRecursiveImpl[T]('body) }
def deepRecursiveImpl[T](body: Expr[T])(using Quotes, Type[T]): Expr[T] =
  import quotes.reflect.*

  val methSymbol = Symbol.spliceOwner.owner
  if methSymbol.flags.is(Flags.Synthetic) then
    report.errorAndAbort(
      "deepRecursive: must be used directly in the body of a named `def`, not inside a lambda " +
        "(e.g. a `val`/`lazy val` holding a function value) - recursive calls there reference " +
        "the val, not this closure, so they can't be trampolined",
    )
  val termParams = methSymbol.paramSymss.flatten.filter(_.isTerm)

  val loopMethod = Symbol.newMethod(
    methSymbol,
    Symbol.freshName("loop"),
    MethodType(termParams.map(_.name))(
      _ => termParams.map(_.termRef.widen),
      _ => TypeRepr.of[TailRec].appliedTo(TypeRepr.of[T]),
    ),
  )

  object selfCallCollector extends TreeAccumulator[List[Apply]]:
    def foldTree(acc: List[Apply], tree: Tree)(owner: Symbol): List[Apply] = tree match
      case app@Apply(fun, _) if fun.symbol == methSymbol => app :: acc
      case _: If | _: Match | _: Try | _: While | _: Closure | _: DefDef =>
        foldOverTree(Nil, tree)(owner) match
          case Nil => acc
          case unsafe =>
            report.errorAndAbort(
              "deepRecursive: recursive call is nested under a condition, loop, try, or closure " +
                "that this macro cannot safely trampoline (it would run unconditionally and only " +
                "once instead of following the original control flow)",
              unsafe.head.pos,
            )
      case _ => foldOverTree(acc, tree)(owner)

  @tailrec def flattenArgs(tree: Term, acc: List[Term] = Nil): List[Term] = tree match
    case Apply(fun, args) => flattenArgs(fun, args ::: acc)
    case _ => acc

  def replaceSubtrees(tree: Term, mapping: Seq[(find: Term, replace: Expr[T])]): Expr[T] =
    object replacer extends TreeMap:
      override def transformTerm(t: Term)(owner: Symbol): Term =
        mapping.find(_.find eq t).map(_.replace.asTerm).getOrElse(super.transformTerm(t)(owner))

    replacer.transformTerm(tree)(Symbol.spliceOwner).asExprOf[T]

  def wrapLeaf(tree: Term): Term =
    val calls = selfCallCollector.foldTree(Nil, tree)(Symbol.spliceOwner).reverse

    def buildChain(remaining: List[Apply], bound: Vector[(Term, Expr[T])]): Expr[TailRec[T]] = remaining match
      case Nil => '{ done[T](${ replaceSubtrees(tree, bound) }) }
      case (call@Apply(_, _)) :: rest =>
        '{
          tailcall(${ Ref(loopMethod).appliedToArgs(flattenArgs(call)).asExprOf[TailRec[T]] }).flatMap { (x: T) =>
            ${ buildChain(rest, bound :+ (call, '{ x })) }
          }
        }

    buildChain(calls, Vector.empty).asTerm

  def transform(tree: Term): Term = tree match
    case If(cond, thenp, elsep) =>
      If(cond, transform(thenp), transform(elsep))
    case Match(scrutinee, cases) =>
      Match(scrutinee, cases.map(c => CaseDef(c.pattern, c.guard, transform(c.rhs))))
    case Block(stats, expr) =>
      Block(stats, transform(expr))
    case Typed(expr, _) =>
      transform(expr)
    case Inlined(call, bindings, expr) =>
      Inlined(call, bindings, transform(expr))
    case _ =>
      wrapLeaf(tree)

  val paramSubstitution = termParams.iterator.zip(loopMethod.paramSymss.iterator.flatten).toMap

  object renameParams extends TreeMap:
    override def transformTerm(t: Term)(owner: Symbol): Term = t match
      case ident: Ident if paramSubstitution.contains(ident.symbol) =>
        Ref(paramSubstitution(ident.symbol))
      case _ => super.transformTerm(t)(owner)

  val renamedBody = renameParams.transformTerm(body.asTerm)(loopMethod)
  val loopBody = transform(renamedBody).changeOwner(loopMethod)
  val loopDefDef = DefDef(loopMethod, _ => Some(loopBody))
  val loopCall = Ref(loopMethod).appliedToArgs(termParams.map(Ref.apply)).asExprOf[TailRec[T]]

  Block(List(loopDefDef), '{ $loopCall.result }.asTerm).asExprOf[T]
```

`flattenArgs` picked up the same fix as `sum` back at the start of this post: an accumulator parameter turns it properly
tail-recursive, so `@tailrec` accepts it. And one more guard showed up alongside the control-flow one: `deepRecursive`
used inside a lambda instead of a named `def`'s body:

```scala 3
val f: Int => Int = n => deepRecursive {
  if n == 0 then 0 else 1 + f(n - 1)
}
```

fails on purpose.

`methSymbol.flags.is(Flags.Synthetic)` catches it before any of the rest of the macro runs. Inside a lambda,
`Symbol.spliceOwner.owner` isn't a named method with its own `paramSymss`. It's the compiler-generated apply method
backing the closure, so `f` in the body refers to the *val* holding the lambda, never to `methSymbol` itself. Every
self-call check downstream depends on `fun.symbol == methSymbol` matching; here it never would, so without this guard
`f(n - 1)` would just fall through as an ordinary, un-trampolined call, silently as stack-unsafe as the code this macro
exists to fix.

## Guardrails Against Guessing Wrong

`buildChain` assumes every call `selfCallCollector` hands it runs exactly once, unconditionally, right where it was
found. Two shapes break that assumption without changing what the code looks like at a glance:

```scala 3
def f(n: Int): Int = deepRecursive:
  if n == 0 then 0 else List(1, 2, 3).map(_ => f(n - 1)).sum
```

The self-call sits inside a lambda passed to `.map`. Trampolining it the normal way means evaluating it once, up front,
at the position `selfCallCollector` found it, but the lambda is meant to run three times, once per list element. And:

```scala 3
def g(n: Int): Int = deepRecursive:
  try 1 + g(n - 1) catch case _: Exception => -1
```

Here the self-call has to run inside the `try`'s dynamic extent for `catch` to see its exceptions. The trampoline's own
driver, `.result`, runs later and elsewhere, by the time it calls `loop` again, the original `try` has already returned.

Both would compile silently wrong under the macro from the previous section: a call count quietly changed from three to
one, or a `catch` that stops catching. `selfCallCollector` closes that gap by refusing to guess:

```scala 3
object selfCallCollector extends TreeAccumulator[List[Apply]]:
  def foldTree(acc: List[Apply], tree: Tree)(owner: Symbol): List[Apply] = tree match
    case app@Apply(fun, _) if fun.symbol == methSymbol => app :: acc
    case _: If | _: Match | _: Try | _: While | _: Closure | _: DefDef =>
      foldOverTree(Nil, tree)(owner) match
        case Nil => acc
        case unsafe =>
          report.errorAndAbort(
            "deepRecursive: recursive call is nested under a condition, loop, try, or closure " +
              "that this macro cannot safely trampoline (it would run unconditionally and only " +
              "once instead of following the original control flow)",
            unsafe.head.pos,
          )
    case _ => foldOverTree(acc, tree)(owner)
```

Hitting one of these six node kinds mid-search doesn't stop the fold. It re-runs `foldOverTree` on just that subtree
with a fresh accumulator, `Nil`, to check whether a self-call is hiding underneath. An empty result means the risky
construct contains nothing recursive, so it's harmless and the outer `acc` passes through untouched. A non-empty result
means a self-call sits somewhere its call count or exception handling would change if it were extracted, and compilation
aborts there instead of continuing:

```text
deepRecursive: recursive call is nested under a condition, loop, try, or closure that this macro
cannot safely trampoline (it would run unconditionally and only once instead of following the
original control flow)
  else List(1, 2, 3).map(_ => f(n - 1)).sum
                                ^^^^^^^^
```

Both `f` and `g` above fail to compile with exactly that message, pointing straight at the offending call. So does a
self-call sitting inside an `if` that isn't the outer branch dispatch `transform` already understands, like
`1 + (if flag then h(n - 1, flag) else 0)`, the same six-case check catches it whether the risky construct is the whole
function body or three levels deep inside an arithmetic expression.

## Case Closed

To be clear, `deepRecursive` is an experimental proof of concept. It targets direct self-recursion within a single
method body. It does not support mutual recursion between separate functions, and as we saw with non-tail block
statements, certain structural shapes can still bypass the macro without warning. A far more elegant long-term solution
would be expanding the capabilities of `@tailrec` itself, either through a compiler plugin or a direct contribution to
the compiler. Handling trampolining at the compiler level would eliminate the blind spots of AST macros entirely while
providing a seamless, built-in experience. Even so, this experiment proves an important point: we do not need
coroutines, monadic effect libraries, or Project Loom to write direct-style, stack-safe deep recursion in Scala 3.
Kotlin achieved this by relying on language-level suspend functions, but Scala's metaprogramming allows us to pull off
the same trick purely at compile time.

