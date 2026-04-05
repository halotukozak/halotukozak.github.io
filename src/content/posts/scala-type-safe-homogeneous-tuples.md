---
title: 'Homogeneous Tuples in Scala 3'
published: 2026-04-06
draft: true
tags: [ 'scala', 'type-level', 'compile-time' ]
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

## Naive Approach: Just Use Tuple.map

Tuples in Scala 3 have a `map` method. But it takes
a [polymorphic function](https://docs.scala-lang.org/scala3/reference/new-types/polymorphic-function-types.html)
`[t] => t => F[t]` — inside that lambda,
`t` is abstract. You don't know it's `Int`, so you can't call `Int`-specific operations:

```scala 3
val tup = (1, 2, 3)

// Won't compile — t is not known to be Int:
// tup.map([t] => (x: t) => x + 1)

// You'd have to cast, losing all safety:
tup.map[[X] =>> Int]([t] => (x: t) => x.asInstanceOf[Int] + 1)
// Returns (2, 3, 4), but nothing stops you from calling this on ("a", "b", "c")
```

We have to explicitly pass `[[X] =>> Int]` as the result type because the compiler can't infer what `F` should be when
the return type doesn't match `t`. And of course, the compiler won't stop you from writing the same code for
`("a", "b", "c")` — you'd get a `ClassCastException` instead of a compile error.

## Converting to Array or List? Also Broken

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

## Step 1: A Match Type

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

Let's test it with `summon` which materializes a given at compile time or fails:

```scala 3
// These compile:
summon[ContainsOnly[(Int, Int, Int), Int] =:= true]
summon[ContainsOnly[EmptyTuple, String] =:= true]

// This doesn't compile:
// summon[ContainsOnly[(Int, String, Int), Int] =:= true]
// Error: Cannot prove that false =:= true
```

It works! But match types have a limitation. You might think you could use the match type directly as a constraint:

```scala 3
// Doesn't work — you can't manually construct =:= evidence:
def processInts[Tup <: Tuple](tup: Tup)(using ContainsOnly[Tup, Int] =:= true): String =
  "all ints!"

// The compiler won't let you call this — =:= evidence can only be summoned,
// not passed explicitly. And summoning requires the match type to be fully
// reduced, which doesn't happen with abstract Tup.
```

The problem is that `=:=` evidence is something the compiler synthesizes — you can't construct it by hand. And when
`Tup` is abstract (as in a generic method), the compiler can't reduce the match type, so it can't produce the evidence.
We need to move the match type reduction into a `given` definition, where the compiler resolves it at the *call site*
(where concrete types are known).

## Step 2: The Type Class

The standard approach: wrap the match type in a type class whose `given` instance can only be synthesized when the
match type reduces to `true`.

A first attempt with a regular class:

[//]: # (@formatter:off)
```scala 3
class containsOnly[Tup <: Tuple, T]

object containsOnly:

  private type Loop[Tup <: Tuple, T] <: Boolean = Tup match
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

One subtlety: we'd like `Loop` to be `private`, but the compiler requires it to be visible since the `given` signature
references it. In the opaque type version below this is less of a problem — the whole companion is the abstraction
boundary.

This works — `containsOnly` instances are only synthesized when `Loop` reduces to `true`. But every summon allocates a
new `containsOnly()` object at runtime, even though the instance carries no data. It's a pure compile-time proof that
wastes heap space.

We could create a single reusable instance to avoid repeated allocations, but we can do even better — eliminate the
object entirely with an [opaque type](https://docs.scala-lang.org/scala3/reference/other-new-features/opaques.html):

[//]: # (@formatter:off)
```scala 3
opaque infix type containsOnly[Tup <: Tuple, T] = Boolean

object containsOnly:

  type Loop[Tup <: Tuple, T] <: Boolean = Tup match
    case EmptyTuple => true
    case T *: tail => Loop[tail, T]
    case _ => false

  inline given [Tup <: Tuple, T] => (Loop[Tup, T] =:= true) => containsOnly[Tup, T] = true
```
[//]: # (@formatter:on)

Now `containsOnly[Tup, T]` is just a `Boolean` at runtime — no allocation. The `=:=` evidence ensures the compiler
only synthesizes this given when `Loop` reduces to `true`. If you try to summon `containsOnly[(Int, String), Int]`,
the evidence can't be constructed and compilation fails.

The `infix` modifier lets us write `Tup containsOnly T` instead of `containsOnly[Tup, T]` — a small readability win.

Let's test that the type class works as a constraint:

```scala 3
def processInts[Tup <: Tuple](tup: Tup)(using Tup containsOnly Int): Int =
  tup.toList.asInstanceOf[List[Int]].sum // safe now — the proof guarantees all elements are Int

processInts((1, 2, 3))     // compiles: 6
processInts(EmptyTuple)     // compiles: 0
// processInts((1, "nope", 3))  // doesn't compile!
// error: No given instance of type containsOnly[(Int, String, Int), Int] was found
```

The error message is clear — the compiler tells you exactly which tuple doesn't satisfy the constraint.

Now we have a reusable, zero-cost proof that a tuple is homogeneous. Time to do something useful with it.

## Step 3: mapOnly

Now let's put `containsOnly` to work. I want a `mapOnly` extension on `Tuple` that requires a `containsOnly` proof,
applies a polymorphic function to each element, and preserves the full type information in the result.

We use `extension (tup: Tuple)` with `tup.type` — the singleton type — so the compiler tracks the *exact* tuple type
through the call, preserving full type information in the result.

A first attempt — one method with all type parameters:

```scala 3
extension (tup: Tuple)
  inline def mapOnly[T, F[_ <: T]](
    inline f: [t <: T] => t => F[t],
  )(using tup.type containsOnly T): Tuple.Map[tup.type, [X] =>> F[X & T]] =
    tup.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

This compiles, but using it is painful — Scala can't partially infer type parameters, so you must specify *both*
`T` and `F` explicitly:

```scala 3
// You'd have to write:
(1, 2, 3).mapOnly[Int, Option]([t <: Int] => (x: t) => Some(x): Option[t])

// But you can't write this (F can't be inferred from T alone):
// (1, 2, 3).mapOnly[Int]([t <: Int] => (x: t) => Some(x): Option[t])
```

We want to fix `T` first (via `mapOnly[Int]`) and let the compiler infer `F` from the function we pass.

## Step 4: Currying Type Parameters with a Wrapper

The classic trick: return an intermediate object that captures the first type parameter, then let the caller supply the
second.

```scala 3
extension (tup: Tuple)
  inline def mapOnly[T](using tup.type containsOnly T): MapOnly[T, tup.type] = MapOnly(tup)

class MapOnly[T, Tup <: Tuple](private val underlying: Tup):
  inline def apply[F[_ <: T]](inline f: [t <: T] => t => F[t]): Tuple.Map[Tup, [X] =>> F[X & T]] =
    underlying.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

Let me unpack what's going on:

- `mapOnly[T]` fixes the element type and returns a `MapOnly` wrapper, but only if the `containsOnly` proof exists.
- `MapOnly.apply[F]` takes the higher-kinded type `F` and a polymorphic function `f`.
- [`Tuple.Map[Tup, ...]`](https://scala-lang.org/api/3.x/scala/Tuple.html) computes the result type: if `Tup = (Int, Int, Int)` and `F = Option`, the result
  is `(Option[Int], Option[Int], Option[Int])`.
- The `X & T` intersection ensures the compiler knows each element is a subtype of `T`.

Testing:

```scala 3
val ints = (1, 2, 3)
val opts: (Option[Int], Option[Int], Option[Int]) =
  ints.mapOnly[Int]([t <: Int] => (x: t) => Some(x): Option[t])
// opts = (Some(1), Some(2), Some(3))

val strs = ("a", "b")
val lengths: (List[String], List[String]) =
  strs.mapOnly[String]([t <: String] => (x: t) => List(x): List[t])
// lengths = (List(a), List(b))

// This won't compile:
// (1, "mixed", 3).mapOnly[Int]([t <: Int] => (x: t) => Some(x))
```

It works, but there's a problem. `MapOnly` is a class — every call allocates a wrapper object on the heap. For a
type-level operation that exists purely to curry type parameters, that's wasteful.

## Step 5: Eliminating the Wrapper Allocation

We could try extending `AnyVal`, but it doesn't compose well with generics and the optimization isn't guaranteed. The
proper Scala 3 approach is an opaque type — a compile-time-only abstraction that's erased to its underlying type with
*guaranteed* zero overhead:

```scala 3
opaque type MapOnly[T, Tup <: Tuple] = Tup

object MapOnly:
  extension [T, Tup <: Tuple](mapOnly: MapOnly[T, Tup])
    inline def apply[F[_ <: T]](inline f: [t <: T] => t => F[t]): Tuple.Map[Tup, [X] =>> F[X & T]] = 
      (mapOnly: Tup).map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))

extension (tup: Tuple)
  inline def mapOnly[T](using tup.type containsOnly T): MapOnly[T, tup.type] = tup
```

Inside the `MapOnly` companion, we know that `MapOnly[T, Tup]` *is* `Tup`. Outside, the type system enforces the
abstraction boundary. No allocation, no erasure surprises, no caveats. The API is identical:

```scala 3
val result: (Option[Int], Option[Int], Option[Int]) =
  (1, 2, 3).mapOnly[Int]([t <: Int] => (x: t) => Some(x): Option[t])
// result = (Some(1), Some(2), Some(3))
```

## Step 6: Wait — Can We Skip the Wrapper Entirely?

After all that work on the wrapper, let's check if Scala 3 actually needs it.
Since [SIP-47](https://docs.scala-lang.org/sips/clause-interleaving.html) (clause interleaving), you can mix type and
value parameter clauses freely:

```scala 3
extension (tup: Tuple)
  inline def mapOnly[T](using tup.type containsOnly T)[F[_ <: T]](
    inline f: [t <: T] => t => F[t],
  ): Tuple.Map[tup.type, [X] =>> F[X & T]] =
    tup.map[[X] =>> F[X & T]]([t] => (t: t) => f(t.asInstanceOf[t & T]))
```

That's it. One method. The `using` clause sits between the two type parameter lists, so `T` is fixed first, the
`containsOnly` proof is resolved, and then `F` is provided — all in a single call.

```scala 3
val result = (1, 2, 3).mapOnly[Int]([t <: Int] => (x: t) => Some(x): Option[t])
// result = (Some(1), Some(2), Some(3))

// Compile error — (Int, String) doesn't containsOnly Int:
// (1, "nope").mapOnly[Int]([t <: Int] => (x: t) => Some(x))
// error: No given instance of type containsOnly[(Int, String), Int] was found
```

No wrapper, no opaque type, no `AnyVal`. Clause interleaving makes the entire intermediate-object pattern unnecessary.

## The Journey

We went from runtime `ClassCastException`s through match types, type classes, wrapper classes, opaque types,
and finally arrived at a one-liner using clause interleaving. Each step taught us something about Scala 3's type
system — and the last step reminded us to check if the language already has a simpler way.

I use this `containsOnly` + `mapOnly` pattern in [M&DE](https://github.com/halotukozak/made), where typed pipelines need
to transform homogeneous tuples of domain objects while preserving full type information. If you're building something
similar, grab the code and adjust.

PS. Thesis defended. What do normal people do with their free time?
