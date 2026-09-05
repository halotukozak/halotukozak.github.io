---
title: "Efficient Derivation With No Macros: Extending Scala 3 Mirrors with M&DE"
description: "Scala 3 Mirrors give you a type's shape, but not its custom field names, default values, or annotations, and they refuse value classes outright. M&DE derives an enriched mirror that carries all of that, plus Done, an operation-centric mirror for services and RPC interfaces, at a bytecode and compile-time cost a real codec library has now measured."
published: 2026-09-05
draft: false
tags: [ 'Scala', 'Scala 3', 'Mirror', 'derivation', 'metaprogramming', 'compile-time', 'macro', 'type class', 'performance' ]
toc: true
---

## Where Mirrors Stop

Scala 3's `scala.deriving.Mirror` retired most of what Shapeless and hand-written Scala 2 macros used to do. The
compiler synthesizes a `Mirror.ProductOf[T]` for every case class and a `Mirror.SumOf[T]` for every sealed trait or
enum, and you walk a type's structure from there at compile time. On the strength of that alone I got a real
derivation [most of the way with no macros](/posts/scala-type-class-derivation-with-no-macros).

The trouble starts once your derivation needs more than field names and types. It never lets you rename a field on the
wire: the label stays `id`, whatever `@name` you attach. It carries no information about default values, and summoning a
`Mirror` for a case class that is also a value class fails outright. Annotations get no support at all. `Made` fills
these, and not only these, gaps. Once its own mirror is derived, every consumer builds on it with ordinary inline code,
no macro of their own.

## The `Made` Mirror

`Made` is a small hierarchy of mirror kinds: `Made.Product` for case classes (including value classes), `Made.Sum`
for sealed hierarchies, `Made.Singleton` for objects, and `Made.Transparent` for `@transparent` wrappers, single-field
case classes annotated to derive by delegating to their one field instead of being treated as a one-field product. Every
instance carries the `Label`, `ElemLabels`, and `ElemTypes`, plus two members standard `Mirror` has no equivalent for:
`Metadata`, which lets you query annotations, and `GeneratedElems`, which exposes synthetic members you define yourself.

## What `Made` Gives You

### Default Values

`MadeFieldElem.default` returns `Type | NotExists`: the value when one exists, the `NotExists` sentinel when it does
not. `Made` resolves it once during derivation, along a priority chain where the first match wins:

1. `@whenAbsent(value)`, an explicit annotation default
2. `@optionalParam`, which summons `Default[T]` for an empty value (`None` for `Option`, `null` for `T | Null`)
3. the Scala constructor default
4. `NotExists`

```scala 3
import halotukozak.made.*
import halotukozak.made.annotation.*

case class Config(
  host: String,
  @whenAbsent(8080) port: Int = 0,
  @optionalParam timeout: Option[Int],
  retries: Int = 3,
)

val (host, port, timeout, retries) = Made.derived[Config].elems

host.default // NotExists
port.default // 8080  (the annotation wins over the constructor default of 0)
timeout.default // None  (via Default[Option[Int]])
retries.default // 3
```

Exposed defaults buy you partial construction. A `FromMap[T]` that builds a `T` from a `Map[String, Any]` falls back to
`elem.default` when a key is missing. `derivedProduct` needs a proxy `derived` due to the implicit search:
ordinary resolution can't land on the narrowed `Made.ProductOf[T]` on its own, only on the general `Made.Of[T]`
the top-level `given` actually produces.

```scala 3
inline def derivedProduct[T: Made.ProductOf as m]: FromMap[T] = source =>
  val labels = compiletime.constValueTuple[m.ElemLabels].toList.asInstanceOf[List[String]]
  val elems = m.elems.toList.asInstanceOf[List[MadeFieldElem]]

  val values = labels.zip(elems).map: (label, elem) =>
    source.get(label).getOrElse:
      elem.default match
        case NotExists => throw IllegalArgumentException(s"Missing key '$label' with no default")
        case default => default

  m.fromUnsafeArray(values.toArray)

inline def derived[T](using m: Made.Of[T]): FromMap[T] = inline m match
  case given Made.ProductOf[T] => derivedProduct[T]
```

`fromUnsafeArray(Array[Any])` and the typed `fromTuple(elems: ElemTypes)` are the two constructors on
`Made.Product`. `fromTuple` skips the `Array[Any]` boxing when you already hold a proper tuple.

### Annotations

Every `Made` mirror, and every element in it, has `type Metadata <: Tuple`. It is `EmptyTuple` when nothing relevant is
attached, otherwise `Meta @Ann1 *: Meta @Ann2 *: ...`, with `Meta` an empty marker and the annotations carried as
refinements.

An annotation joins in by extending `MetaAnnotation`, itself a `scala.annotation.RefiningAnnotation` so it survives into
the refinement. `Made` captures only annotations that extend `MetaAnnotation`, standard-library or custom, and skips
everything else on purpose.

```scala 3
import halotukozak.made.*
import halotukozak.made.annotation.*

class JsonName(val value: String) extends MetaAnnotation

@JsonName("user")
case class User(@JsonName("user_name") name: String)

val mirror = Made.derived[User]

mirror.hasAnnotation[JsonName] // true
mirror.getAnnotation[JsonName].value // "user"

val name *: EmptyTuple = mirror.elems
name.getAnnotation[JsonName].value // "user_name"
```

`hasAnnotation` and `getAnnotation` are `transparent inline`. They resolve against the `Metadata` tuple during
expansion, so the result is a compile-time constant with nothing reflective left at runtime. `getAnnotation[A]` has type
`A | NotExists`; when the macro can already prove the annotation is present it narrows to `A` directly (`.value`
above needs no unwrapping), otherwise generic code recovers `A` by matching on `NotExists` or via the `.exists` /
`.notExists` extensions.

> The [`containsOnly`](/posts/scala-type-safe-homogeneous-tuples) evidence from my tuples post does the work here.
> The mirror carries a path-dependent `Metadata containsOnly Meta` given, so these extension methods prove the tuple
> is homogeneous.

### Generated Members

`Made` has a concept standard `Mirror` doesn't: a member that isn't a constructor parameter. Put `@generated` on a
`val` or `def` and it shows up in a separate `generatedElems` tuple as a `GeneratedMadeElem`:

```scala 3
import halotukozak.made.*
import halotukozak.made.annotation.*

case class Measurement(value: Double, unit: String):
  @generated def display: String = s"$value $unit"

val mirror = Made.derived[Measurement]
val (valueFld, unitFld) = mirror.elems // constructor fields
val displayGen *: EmptyTuple = mirror.generatedElems // the @generated def

displayGen(Measurement(9.81, "m/s")) // "9.81 m/s"
```

The separation is on purpose. Generated members cannot feed `fromUnsafeArray`, since you compute them from an instance
rather than store them, so existing product derivation keeps running and never meets them. Code that wants them, say a
JSON schema generator emitting a read-only `fullName`, opts in by walking `generatedElems`. A
`GeneratedMadeElem` adds `OuterType` and `apply(outer)`, and its `default` is always `NotExists`. It works on products,
sums, and singletons, not on `@transparent` types.

### Transparent Wrappers

Domain code fills up with single-field newtypes: `Email(value: String)`, `UserId(value: Long)`. Deriving a type class
for one, you usually want to delegate to the inner type instead of treating it as a one-field product.
`@transparent` makes `Made.derived` return a `Made.Transparent` mirror:

```scala 3


val mirror = Made.derived[Email]

@transparent
case class Email(value: String)

mirror.unwrap(Email("alice@example.com")) // "alice@example.com"
mirror.wrap("bob@example.com") // Email("bob@example.com")
```

A macro generates `unwrap` and `wrap` as a direct field read and a direct constructor call. A type class built on top
can print or encode a transparent type as its inner value directly.

## `Done`: A Mirror for Behavior

`Made` describes a type by its data: constructor parameters or subtypes. A `trait` whose whole point is its methods
carries no data worth mirroring, and `Done` covers that case: services, RPC interfaces, and enums whose cases carry no
data of their own but share methods that behave differently per case.

```scala 3
import halotukozak.made.*

trait Service:
  def ping(message: String): Boolean

  def version: Int

val done = Done.derived[Service]
```

Every `val`, `def`, and field of `T` turns into a `DoneOperation` that records, at the type level, its `Label`,
`Metadata`, `InputElems` (one `InputElem` per parameter, multi-parameter-list methods flattened with a `ParamLists`
tuple marking the boundaries), `OutputType`, and `OuterType`. Inherited methods you did not override still appear.
Overloads become separate operations under one label. The synthetic `$default$N` accessors do not come through.

Running one means calling `apply(outer, args)`, which compiles to a direct virtual call with the arguments unboxed by
position; two mix-ins cover the common shapes: `EmptyApply` for `apply(outer)`, `SingleApply` for
`apply(outer, arg)`.

```scala 3
val impl: Service = new Service:
  def ping(message: String) = message.nonEmpty

  def version = 3

val ping *: version *: EmptyTuple = done.operations

ping.apply(impl, "hi") // true, via SingleApply's apply(outer, arg)
version.apply(impl) // 3
done.invoke(ping, impl, Tuple1("hi")) // same call through `invoke`, argument list Args-shaped, target type checked against Done.Type
```

`materializeTo` goes the other way, building a trait instance from a tuple of per-operation handlers and checking them
at compile time:

```scala 3
val handlers = (
  (args: (a: Int, b: Int)) => args.a + args.b,
  () => "calc",
  () => true,
)
val c: Calc = handlers.materializeTo[Calc]
c.add(2, 3) // 5
```

Wrong arity, or the wrong handler shape entirely fail to compile.

`Done` is the youngest part of the library and still moving. Nevertheless, the invoke and materialize pair already
covers most generic-proxy and test-double work.

## What About Performance?

I've put the no-macro claim to the test on a downstream library. [mcodec](https://github.com/halotukozak/mcodec)
is a GenCodec-style JSON codec I built entirely on `Made.derived`. Benchmarked against circe, jsoniter-scala, uPickle,
zio-json, borer, play-json, and AVSystem's original Scala 2 GenCodec macro, on both compile time and runtime throughput.
Full numbers, methodology, and caveats live in
[mcodec's benchmark docs](https://github.com/halotukozak/mcodec/blob/main/docs/_docs/benchmarks.md). Here I only cover
the part that says something about M&DE itself.

mcodec's own derivation carries no macros of its own. `MCodec.derived` is an `inline match` over `Made.Of[T]`:
pattern-match on the mirror kind, walk `mirror.elems` at the type level for labels and instance summoning, drop to plain
runtime code for the rest. I held every optimization in mcodec's benchmark history to one rule: no new macro, blackbox
or otherwise.

Under that constraint, the numbers still moved. Compiling 100 derived codecs cost 14 seconds and 9,105 KB of bytecode
when I started; today it costs 9.6 seconds and 2,900 KB, the fourth-lightest bytecode footprint of the eight libraries,
ahead of uPickle's 10.0 seconds on compile time. How I got there is its own story, covered below. Worth repeating here:
mcodec still isn't the fastest-compiling library in the field, but every bit of this came without a single new macro,
blackbox or whitebox.

![compile time scaling with the number of derived codecs](https://raw.githubusercontent.com/halotukozak/mcodec/main/docs/_assets/images/benchmarks/compile-scaling.png)
![emitted bytecode scaling with the number of derived codecs](https://raw.githubusercontent.com/halotukozak/mcodec/main/docs/_assets/images/benchmarks/bytecode-scaling.png)

Runtime performance wasn't the priority; it happened to work out like this: on writes, mcodec now beats every library in
the comparison except jsoniter-scala and zio-json. Read numbers look different, trailing zio-json, borer, and
jsoniter-scala, and slowest of the group on the self-recursive `Geometry` ADT.

![write throughput relative to mcodec](https://raw.githubusercontent.com/halotukozak/mcodec/main/docs/_assets/images/benchmarks/serde-write.png)
![read throughput relative to mcodec](https://raw.githubusercontent.com/halotukozak/mcodec/main/docs/_assets/images/benchmarks/serde-read.png)

None of that bytecode drop came from touching mcodec's own derivation code. The single largest cut, 9,105 KB down to
4,986 KB, came from a `made` 0.6.0 change that had nothing to do with codecs: before it, mirrors compiled each
`MadeFieldElem` in the `elems` tuple to its own anonymous class per field, generated fresh at every derivation site;
0.6.0 collapsed that into shared concrete classes carrying real type parameters. The same change cut `typer` time by 23%
and `genBCode` time by 42%, the two phases that elaborate and emit those classes. That is the point of putting the
mirror behind a shared library instead of a macro per project.

Compile time is mcodec's weakest number against the field, and the reason traces to one mechanism: `Made.derived` is a
`transparent inline given`, so Scala expands the call during `inlining` and then re-elaborates the expanded code through
`typer` a second time. A macro-based library skips that second pass entirely: it splices in a tree the macro already
built fully typed, so the compiler never has to check it again. mcodec's own `typer` cost is the highest in the
comparison: uPickle runs 30% below it, and the rest of the field sits 51-68% below it, play-json trailing furthest.
`inlining` is a little more competitive, 14-15% below the two highest, uPickle and circe. Being macro-based buys no
guarantee either: uPickle posts the worst `inlining` number and the second-worst `typer` in the whole group.

![compiler phase breakdown across libraries](https://raw.githubusercontent.com/halotukozak/mcodec/main/docs/_assets/images/benchmarks/compile-phases.png)

## Trying It

M&DE is published to Maven Central as `com.halotukozak::made`, you can add it to your project with:

```scala 3
//> using scala 3.9.0
//> using dep com.halotukozak::made::0.6.0
```

It borrows from [AVSystem commons](https://github.com/AVSystem/scala-commons)
and [ops-mirror](https://github.com/bishabosha/ops-mirror).

[mcodec](https://github.com/halotukozak/mcodec) is the fullest example of what building on it looks like in practice.

If you build something on it, I would like to hear about it!

## References

- [M&DE Repository](https://github.com/halotukozak/made)
- [mcodec Repository](https://github.com/halotukozak/mcodec)
- [Mirror and type class derivation](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html)
- [`scala.compiletime`](https://docs.scala-lang.org/scala3/reference/metaprogramming/compiletime-ops.html)
- [Scala Type Class Derivation with (almost) no macros](/posts/scala-type-class-derivation-with-no-macros)
- [Homogeneous Tuples in Scala 3](/posts/scala-type-safe-homogeneous-tuples)
- [Yes, You Can Debug a Scala 3 Macro](/posts/yes-you-can-debug-a-scala-3-macro)
