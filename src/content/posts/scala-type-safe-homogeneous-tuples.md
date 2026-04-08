---
title: 'Homogeneous Tuples in Scala 3'
description: 'How to prove at compile time that a Scala 3 tuple contains only elements of a single type, using match types, opaque types, and clause interleaving.'
published: 2026-04-06
draft: false
tags: [ 'scala', 'scala-3', 'tuple', 'compile-time', 'type-safety' ]
toc: true
---

## The Problem: Tuples That Lie

Scala 3 tuples are heterogeneous by design. `(1, "hello", true)` is a `(Int, String, Boolean)` — each element has its
own type. But sometimes you *know* all elements share a single type. Maybe you're collecting database column IDs, or
accumulating configuration values, or — as in my case — building typed pipelines where a tuple of transformations all
operate on the same domain.

"Why not just use a `List[Int]`?" — because tuples carry their *arity* and *per-element types* at compile time. In a
larger structure you might have `(Column[Int], Column[Int], Column[String])` where only some positions share a type.
You want to operate on the homogeneous prefix without losing track of what's where. And you don't want runtime checks
— the whole point is to catch mismatches before the code runs.

The compiler doesn't help you here. A `(Int, Int, Int)` is still three separate types glued together, and Scala offers
no built-in way to say "this tuple contains only `Int`s."

Let's see what happens when you try.

## What Doesn't Work

### Tuple.map

Tuples in Scala 3 have a `map` method. But it takes
a [polymorphic function](https://docs.scala-lang.org/scala3/reference/new-types/polymorphic-function-types.html)
`[t] => t => F[t]` — inside that lambda, `t` is abstract. You don't know it's `Int`, so you can't call `Int`-specific
operations:

```scala 3
val tup = (1, 2, 3)

// Won't compile — t is not known to be Int:
//tup.map([t] => (x: t) => x + 1)

// You'd have to cast, losing all safety:
tup.map[[X] =>> Int]([t] => (x: t) => x.asInstanceOf[Int] + 1)
// Returns (2, 3, 4), but nothing stops you from calling this on ("a", "b", "c")
```

We have to explicitly pass `[[X] =>> Int]` as the result type because the compiler can't infer what `F` should be when
the return type doesn't match `t`. And of course, the compiler won't stop you from writing the same code for
`("a", "b", "c")` — you'd get a `ClassCastException` instead of a compile error.

### Converting to Array or List

OK, so `map` doesn't work without casts. What about converting the whole tuple to an `Array` or `List` first?

```scala 3
val tup: Tuple = (1, 2, 3)

// Array: JVM arrays are reified — Array[Object] cannot be cast to Array[Int]
tup.toArray.asInstanceOf[Array[Int]] // ClassCastException!

// You can map element-by-element, but that's a runtime cast with zero compile-time safety:
tup.toArray.map(_.asInstanceOf[Int]).sum // works, but (1, "oops", 3) blows up at runtime

// List: erasure means the cast silently succeeds...
tup.toList.asInstanceOf[List[Int]].sum // returns 6
// ...but on a mixed tuple the bug just hides until you actually use the values:
val mixed: Tuple = (1, "oops", 3)
mixed.toList.asInstanceOf[List[Int]].sum // ClassCastException — far from the real mistake
```

Every approach so far either crashes at runtime or silently hides the bug. We need a way to prove, at compile time,
that a tuple contains only elements of a given type.

## The containsOnly Proof

### A Match Type

Scala 3's [match types](https://docs.scala-lang.org/scala3/reference/new-types/match-types.html) let us compute types
based on pattern matching at the type level. Here's the idea: walk the tuple recursively and check that every element
matches the target type.

```scala 3
type ContainsOnly[Tup <: Tuple, T] <: Boolean = Tup match
  case EmptyTuple => true
  case T *: tail => ContainsOnly[tail, T]
  case _ => false
```

This reads naturally: an empty tuple trivially contains only `T`, a tuple whose head is `T` recurses on the tail,
anything else is `false`.

Let's test it with `summon`, which materializes a given at compile time or fails:

```scala 3
// These compile:
summon[ContainsOnly[(Int, Int, Int), Int] =:= true]
summon[ContainsOnly[EmptyTuple, String] =:= true]

// This doesn't compile:
// summon[ContainsOnly[(Int, String, Int), Int] =:= true]
// Error: Cannot prove that false =:= true
```

It works! You could even use the match type directly as a constraint with `=:=`:

```scala 3
def processInts[Tup <: Tuple](tup: Tup)(using ContainsOnly[Tup, Int] =:= true): String =
  "all ints!"

processInts((1, 2, 3)) // compiles!
// processInts((1, "x", 3)) // doesn't compile — Cannot prove that false =:= true
```

This works, but has two problems. The error message is cryptic — "Cannot prove that false =:= true" says nothing about
*which type* broke it. And `=:=` has no public constructor, so you can't create an instance yourself — meaning there's
no escape hatch for cases where you *know* the constraint holds but the compiler can't prove it (e.g. after a runtime
check). A dedicated type class solves both.

### The Type Class

The standard approach: wrap the match type in a type class whose `given` instance can only be synthesized when the match
type reduces to `true`.

A first attempt with a regular class:

[//]: # (@formatter:off)
```scala 3
@implicitNotFound("${Tup} does not contain only ${T}")
class containsOnly[Tup <: Tuple, T]

object containsOnly:

  type Loop[Tup <: Tuple, T] <: Boolean = Tup match
    case EmptyTuple => true
    case T *: tail => Loop[tail, T]
    case _ => false

  inline given [Tup <: Tuple, T] => (Loop[Tup, T] =:= true) => containsOnly[Tup, T] = containsOnly()
```
[//]: # (@formatter:on)

Here we use the new [given syntax](https://docs.scala-lang.org/scala3/reference/contextual/givens.html) introduced in
Scala 3.6. Instead of `given [Tup, T](using ...): Result`, we write `given [Tup, T] => (...) => Result` — each `=>`
introduces a new clause. The type parameters come first, then the context parameter (`Loop[Tup, T] =:= true` — our
proof that the match type reduced to `true`), and finally the result type. It reads left-to-right: "for any `Tup` and
`T`, given that `Loop[Tup, T]` equals `true`, produce a `containsOnly[Tup, T]`."

One subtlety: we'd like `Loop` to be `private`, but it can't be — the compiler needs to see it at the call site to
reduce `Loop[Tup, T]` and resolve the `=:=` evidence.

This works — `containsOnly` instances are only synthesized when `Loop` reduces to `true`. But every summon allocates a
new `containsOnly()` object at runtime, even though the instance carries no data. It's a pure compile-time proof that
wastes heap space.

We could create a single reusable instance to avoid repeated allocations, but we can do even better — eliminate the
object entirely with an [opaque type](https://docs.scala-lang.org/scala3/reference/other-new-features/opaques.html):

[//]: # (@formatter:off)
```scala 3
@implicitNotFound("${Tup} does not contain only ${T}")
opaque infix type containsOnly[Tup <: Tuple, T] = Boolean

object containsOnly:

  type Loop[Tup <: Tuple, T] <: Boolean = Tup match
    case EmptyTuple => true
    case T *: tail => Loop[tail, T]
    case _ => false

  inline given [Tup <: Tuple, T] => (Loop[Tup, T] =:= true) => containsOnly[Tup, T] = true
```
[//]: # (@formatter:on)

Now `containsOnly[Tup, T]` is just a `Boolean` at runtime — literally the value `true`. No object, no allocation, no
overhead. The `=:=` evidence ensures the compiler only synthesizes this given when `Loop` reduces to `true`. If you try
to summon `containsOnly[(Int, String), Int]`, the evidence can't be constructed and compilation fails.

The `infix` modifier lets us write `Tup containsOnly T` instead of `containsOnly[Tup, T]` — a small readability win.

Let's test that the type class works as a constraint:

```scala 3
def processInts[Tup <: Tuple](tup: Tup)(using Tup containsOnly Int): Int =
  tup.toList.asInstanceOf[List[Int]].sum // safe now — the proof guarantees all elements are Int

processInts((1, 2, 3)) // compiles: 6
processInts(EmptyTuple) // compiles: 0
// processInts((1, "nope", 3))  // doesn't compile!
// error: (Int, String, Int) does not contain only Int
```

The `@implicitNotFound` annotation gives us a human-readable error instead of the generic "No given instance" message.

Now we have a reusable, zero-cost proof that a tuple is homogeneous. Time to do something useful with it.

## Putting containsOnly to Work

### mapAs

Now let's put `containsOnly` to work. I want a `mapAs` extension on `Tuple` that requires a `containsOnly` proof,
applies a polymorphic function to each element, and preserves the full type information in the result.

We use `extension (tup: Tuple)` and refer to `tup.type` in the return type. Why not
`extension [Tup <: Tuple](tup: Tup)`? Because `Tuple.Map[Tup, F]` is a match type — the compiler needs to see a
*concrete* tuple to reduce it. An abstract type parameter `Tup` leaves the match stuck. `tup.type`, however, is the
singleton type of the actual value, so at the call site the compiler knows the exact shape and `Tuple.Map` reduces
correctly.

Note the `asInstanceOf[t & T]` inside the implementation — this cast is safe *because* the `containsOnly` proof
guarantees every element is already a `T`. The cast just narrows the abstract `t` to `t & T` so the bounded
polymorphic function `f` accepts it. Without the proof, this would be exactly the kind of unsafe cast we're trying to
eliminate.

A first attempt — one method with all type parameters:

```scala 3
extension (tup: Tuple)
  inline def mapAs[T, F[_ <: T]](inline f: [t <: T] => t => F[t])(using tup.type containsOnly T): Tuple.Map[tup.type, [X] =>> F[X & T]] =
    tup.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

This compiles, but using it is painful — Scala can't partially infer type parameters, so you must specify *both*
`T` and `F` explicitly:

```scala 3
// You'd have to write:
(1, 2, 3).mapAs[Int, Option]([t <: Int] => (x: t) => Some(x))

// But you can't write this (F can't be inferred from T alone):
// (1, 2, 3).mapAs[Int]([t <: Int] => (x: t) => Some(x))
```

We want to fix `T` first (via `mapAs[Int]`) and let the compiler infer `F` from the function we pass.

### Currying Type Parameters with a Wrapper

The classic trick: return an intermediate object that captures the first type parameter, then let the caller supply the
second.

```scala 3
extension (tup: Tuple)
  inline def mapAs[T](using tup.type containsOnly T): MapAs[T, tup.type] = MapAs(tup)

class MapAs[T, Tup <: Tuple](private val underlying: Tup):
  inline def apply[F[_ <: T]](inline f: [t <: T] => t => F[t]): Tuple.Map[Tup, [X] =>> F[X & T]] =
    underlying.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

Let me unpack what's going on:

- `mapAs[T]` fixes the element type and returns a `MapAs` wrapper, but only if the `containsOnly` proof exists.
- `MapAs.apply[F]` takes the higher-kinded type `F` and a polymorphic function `f`.
- [`Tuple.Map[Tup, ...]`](https://scala-lang.org/api/3.x/scala/Tuple.html) computes the result type: if
  `Tup = (Int, Int, Int)` and `F = Option`, the result is `(Option[Int], Option[Int], Option[Int])`.
- The `X & T` intersection ensures the compiler knows each element is a subtype of `T`.

Testing:

```scala 3
val ints = (1, 2, 3)
val opts: (Option[Int], Option[Int], Option[Int]) = ints.mapAs[Int]([t <: Int] => (x: t) => Some(x))
// opts = (Some(1), Some(2), Some(3))

val strs = ("a", "b")
val lengths: (List[String], List[String]) = strs.mapAs[String]([t <: String] => (x: t) => List(x))
// lengths = (List(a), List(b))

// This won't compile:
// (1, "mixed", 3).mapAs[Int]([t <: Int] => (x: t) => Some(x))
```

It works, but there's a problem. `MapAs` is a class — every call allocates a wrapper object on the heap. For a
type-level operation that exists purely to curry type parameters, that's wasteful.

### Eliminating the Wrapper Allocation

We could try extending `AnyVal`, but the optimization isn't guaranteed. The JVM still allocates when the value class is
used as a generic type parameter, assigned to a supertype, or passed to a method expecting `Any`. The proper Scala 3
approach is an opaque type — a compile-time-only abstraction erased to its underlying type with *guaranteed* zero
overhead:

```scala 3
opaque type MapAs[T, Tup <: Tuple] = Tup

object MapAs:
  extension [T, Tup <: Tuple](mapAs: MapAs[T, Tup])
    inline def apply[F[_ <: T]](inline f: [t <: T] => t => F[t]): Tuple.Map[Tup, [X] =>> F[X & T]] =
      (mapAs: Tup).map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))

extension (tup: Tuple)
  inline def mapAs[T](using tup.type containsOnly T): MapAs[T, tup.type] = tup
```

Inside the `MapAs` companion, we know that `MapAs[T, Tup]` *is* `Tup`. Outside, the type system enforces the
abstraction boundary. No allocation, no erasure surprises, no caveats. The API is identical:

```scala 3
val result: (Option[Int], Option[Int], Option[Int]) = (1, 2, 3).mapAs[Int]([t <: Int] => (x: t) => Some(x))
// result = (Some(1), Some(2), Some(3))
```

### Can We Skip the Wrapper Entirely?

After all that work on the wrapper, let's check if Scala 3 actually needs it.
Since [SIP-47](https://docs.scala-lang.org/sips/clause-interleaving.html) (clause interleaving, stable since Scala
3.4), you can mix type and value parameter clauses freely:

```scala 3
extension (tup: Tuple)
  inline def mapAs[T](using tup.type containsOnly T)[F[_ <: T]](inline f: [t <: T] => t => F[t]): Tuple.Map[tup.type, [X] =>> F[X & T]] =
    tup.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

That's it. One method. The `using` clause sits between the two type parameter lists, so `T` is fixed first, the
`containsOnly` proof is resolved, and then `F` is provided — all in a single call.

```scala 3
val result = (1, 2, 3).mapAs[Int]([t <: Int] => (x: t) => Some(x))
// result = (Some(1), Some(2), Some(3))

// Compile error:
// (1, "nope").mapAs[Int]([t <: Int] => (x: t) => Some(x))
// error: (Int, String) does not contain only Int
```

No wrapper, no opaque type, no `AnyVal`. Clause interleaving makes the entire intermediate-object pattern unnecessary.

Let's peek at what the compiler actually generates (decompiled from bytecode):

[//]: # (@formatter:off)
```java
Tuple3 tup$proxy1 = .MODULE$.apply(BoxesRunTime.boxToInteger(1), BoxesRunTime.boxToInteger(2), BoxesRunTime.boxToInteger(3));
containsOnly$package$ var4 = containsOnly.package..MODULE$;
scala..eq.colon.eq x$1$proxy1 = scala..less.colon.less..MODULE$.refl();
boolean x$2$proxy1 = true;
Function1 f$proxy2 = (t) -> {
    int var1 = BoxesRunTime.unboxToInt(t);
    return scala.Some..MODULE$.apply(BoxesRunTime.boxToInteger(var1));
};
scala.runtime.Tuples..MODULE$.map(tup$proxy1, f$proxy2);
```
[//]: # (@formatter:on)

All the type-level machinery has been erased. The `=:=` evidence becomes a call to `refl()` (a no-op singleton), the
`containsOnly` proof is just `true`, and `mapAs` inlines down to a single `Tuples.map` call with a plain Java lambda.
No wrappers, no intermediate objects — just a tuple, a function, and a runtime map.

## Beyond Type Constructors

### Plain Return Types

So far every example used a type constructor like `Option` or `List` as the result — `F` was always something the
compiler could figure out from the function's return type. But what if your function returns a plain type?

```scala 3
val tup = (1, 2, 3)
tup.mapAs[Int]([x <: Int] => x => x.toString)
```

This fails:

```
Found:    String
Required: (F?[_$1 <: Int])[x]
```

The problem is that `mapAs` expects `F[_ <: T]` — a type constructor that wraps `T`. `Option[Int]` fits because
`Option` is `[X] =>> Option[X]`. But `String` isn't `F[Int]` for any `F` — it has no relationship to the input type,
so the compiler can't infer what `F` should be.

The fix is to tell the compiler explicitly what `F` is — a constant function that ignores its argument and returns
`String`:

```scala 3
tup.mapAs[Int][[X <: Int] =>> String]([x <: Int] => (x: x) => x.toString)
```

Or equivalently, with a named type alias:

```scala 3
type KString[_] = String
tup.mapAs[Int][KString]([x <: Int] => (x: x) => x.toString)
```

This pattern comes up more often than you'd expect — any time the result type doesn't depend on the element type,
you'll need to spell out `F`.

### Limitation: Abstract Type Members

The same explicit-`F` technique suggests another interesting use case. Suppose your elements share a common trait with
an abstract type member:

```scala 3
trait C:
  type T
  def t: T

val tup = (new C { type T = String; val t = "" }, new C { type T = Int; val t = 1 })
```

Each element is a `C`, but its `T` is different. Unfortunatelly, we cannot extract `T` with a match type that peels open the refinement:

```scala 3
type C_Of[t] = C { type T = t }
type Extract_T[X <: C] = X match
  case C_Of[t] => t

tup.mapAs[C][Extract_T]([x <: C] => (x: x) => x.t)
```

Fails with:

```
Found:    x.t
Required: Extract_T[x]
```

A type projection doesn't help either:

```scala 3
tup.mapAs[C][[X <: C] =>> X#T]([x <: C] => (x: x) => x.t)
```

Fails with:
```
x is not a legal path
since it is not a concrete type
```

The root issue is that match types cannot reduce when the scrutinee is an abstract type parameter — the compiler 
doesn't "open" the refinement at the call site. Type projections (`X#T`) require a concrete path, which a polymorphic 
lambda's type parameter is not. As of now, abstract type members remain out of reach for `mapAs`. If you know a workaround,
I'd love to hear it.

## Case Closed

We went from runtime `ClassCastException` through match types, type classes, wrapper classes, opaque types,
and finally arrived at a one-liner using clause interleaving. Each step taught us something about Scala 3's type
system — and the last step reminded us to check if the language already has a simpler way.

I'd like to use `containsOnly` and `mapAs` patterns in [M&DE](https://github.com/halotukozak/made), where typed
pipelines need to transform homogeneous tuples of domain objects while preserving full type information. If you're
building something similar, grab the code and adjust.

PS. Thesis defended. What do normal people do with their free time?

## References

- [Match Types](https://docs.scala-lang.org/scala3/reference/new-types/match-types.html)
- [Opaque Type Aliases](https://docs.scala-lang.org/scala3/reference/other-new-features/opaques.html)
- [SIP-47 — Clause Interleaving](https://docs.scala-lang.org/sips/clause-interleaving.html)
- [Tuple API](https://scala-lang.org/api/3.x/scala/Tuple.html)
- [Polymorphic Function Types](https://docs.scala-lang.org/scala3/reference/new-types/polymorphic-function-types.html)
- [M&DE Repository](https://github.com/halotukozak/made) 
