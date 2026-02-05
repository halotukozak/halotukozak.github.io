---
title: 'Scala Type Class Derivation with (almost) no macros'
published: 2026-02-01
tags: [ 'scala', 'type class', 'compile-time' ]
toc: true
---

## Boilerplate in Type Class Instances

Back in the Scala 2 days, type class derivation was a "dark art". Automating serialization — take AVSystem’s GenCodecs, for instance — required wrestling with the Reflection API or Shapeless. You’d easily end up with 1,200 lines of low-level macro code just to handle the boilerplate of peering into class structures.

With Scala 3, the approach has changed significantly.
We can achieve the same (and more) using the native `Mirror` API and `scala.compiletime` utilities.
Most of the process is now "just Scala code" that runs at compile-time.
We still need a *tiny* bit of macro magic for advanced features like annotation extraction, but we can get 95% of the way there with standard, readable code.

## The Foundation: GenCodec

We assume a robust serialization API already exists.
Our goal isn't to write the serializer itself, but to automate instance creation for complex types.
The `GenCodec` trait defines how to read and write a type `T`.

```scala 3
trait GenCodec[T]:
  def read(input: Input): T
  def write(output: Output, value: T): Unit

object GenCodec:
  // Basic primitives are already defined
  given GenCodec[Boolean] = ???
  given GenCodec[Char] = ???
  given GenCodec[Byte] = ???
  // ... other basic types

  given [C[X] <: Seq[X], T: GenCodec] => GenCodec[C[T]] = ???
  // ... other collections

  // Internal "low-level" derivation methods that handle the 
  // actual serialization logic for different class shapes:
  private def deriveSingleton[T <: Singleton](typeName: String, value: T): GenCodec[T] = ???

  private def deriveSum[T](
    typeName: String,
    instances: Array[GenCodec[?]],
    fieldNames: Array[String],
    classes: Array[Class[?]],
  ): GenCodec[T] = ???

  private def deriveProduct[T <: Product](
    typeName: String,
    instances: Array[GenCodec[?]],
    fieldNames: Array[String],
  ): GenCodec[T] = ???
```

## The Power of Mirrors
Scala 3 introduces `Mirror`, a type class synthesized by the compiler that provides a compile-time representation of a class's structure.
It lets us decompose types into their components without runtime reflection.

* **Mirror.ProductOf[T]**: For case classes (product types).
* **Mirror.SumOf[T]**: For enums and sealed traits (sum types).

Our first attempt at a `derived` method uses these mirrors to extract type information:

```scala 3
inline private def derived[T]: GenCodec[T] = compiletime.summonFrom:
  case m: Mirror.Of[T] =>
    val typeName = compiletime.constValue[m.MirroredLabel]
    val instances =
      compiletime.constValueTuple[Tuple.Map[m.MirroredElemTypes, GenCodec]].toArray.map(_.asInstanceOf[GenCodec[?]])
    val fieldNames = compiletime.constValueTuple[m.MirroredElemLabels].toArray.map(_.asInstanceOf[String])

    m match
      case m: Mirror.ProductOf[T] =>
        deriveProduct(typeName, instances, fieldNames)
      case m: Mirror.SumOf[T] =>
        val classes = compiletime
          .summonAll[Tuple.Map[m.MirroredElemTypes, ClassTag]]
          .toArray
          .map(_.asInstanceOf[ClassTag[?]].runtimeClass)

        deriveSum(typeName, instances, fieldNames, classes)
  case _ => compiletime.error("Cannot derive GenCodec")
```

**compiletime.summonFrom** is a compile-time conditional that pattern matches on available *givens* (implicits) in the current scope. It tries each case in order and uses the first one that successfully resolves. This is the heart of flexible derivation.

**compiletime.constValue** extracts a literal value (like a String `"MR. ROBOT"`) from the type level to the value level. At compile-time, `m.MirroredLabel` is a **singleton type** containing the class name: `constValue` materializes it as a runtime `String`.

**compiletime.constValueTuple** converts a tuple of types into a tuple of values. For example, field labels in a `Mirror` exist as a tuple of singleton string types like `("id", "name")`.

**Tuple.Map** is a type-level operation that transforms each element of a tuple. If you have a tuple of types `(Int, String)` and apply `Tuple.Map[..., GenCodec]`, the compiler computes the type `(GenCodec[Int], GenCodec[String])`.

> Note that we use `.toArray.map(_.asInstanceOf[GenCodec[?]])` instead of a direct cast to `.asInstanceOf[Array[GenCodec[?]]]`.
> In the JVM, arrays are reified, so we cannot cast Array[Any] directly to Array[GenCodec[?]].
> Instead, we convert to an array of `Any` and then map each element to the desired type.

## Recursive Derivation

The simple version works when all fields and subclasses already have `GenCodec` instances, but we want to derive GenCodecs for subclasses recursively.

```scala 3
inline private def summonInstances[Elems <: Tuple](
  summonAllowed: Boolean,
  deriveAllowed: Boolean,
): Tuple =
  inline compiletime.erasedValue[Elems] match
    case _: (elem *: elems) =>
      val elemCodec = compiletime.summonFrom:
        case codec: GenCodec[`elem`] if summonAllowed => codec
        case _ if deriveAllowed => derived[elem]

      elemCodec *: summonInstances[elems](summonAllowed, deriveAllowed)
    case _: EmptyTuple => EmptyTuple
```

**compiletime.erasedValue** lets us pattern match on a type without having a runtime value of that type. It's a no-op at runtime that tells the compiler: "I want to inspect the structure of this type as if I had a value of it."

**inline match** is a powerful Scala 3 feature that ensures the pattern matching is fully expanded at compile-time. Unlike a regular match, `inline match` is resolved by the compiler; the cases that don't match are literally discarded from the generated bytecode, leaving only the branch that corresponds to the actual type.

Now we update `derived` to use recursive summoning:

```scala 3
inline private def derived[T]: GenCodec[T] = compiletime.summonFrom:
    case m: Mirror.Of[T] =>
      val typeName = compiletime.constValue[m.MirroredLabel]
      val fieldNames = compiletime.constValueTuple[m.MirroredElemLabels].toArray.map(_.asInstanceOf[String])

      m match
        case m: Mirror.ProductOf[T] => 
          val instances = summonInstances[m.MirroredElemTypes](summonAllowed = true, deriveAllowed = false).toArray.map(_.asInstanceOf[GenCodec[?]])
          deriveProduct(typeName, instances, fieldNames)
        case m: Mirror.SumOf[T] =>
          val instances = summonInstances[m.MirroredElemTypes](summonAllowed = true, deriveAllowed = true).toArray.map(_.asInstanceOf[GenCodec[?]])
          val classes = compiletime
            .summonAll[Tuple.Map[m.MirroredElemTypes, ClassTag]]
            .toArray
            .map(_.asInstanceOf[ClassTag[?]].runtimeClass)

          deriveSum(typeName, instances, fieldNames, classes)
    case _ => compiletime.error("Cannot derive GenCodec")
```

For product types, we only summon existing instances (no deriving); for sum types, we allow deriving subclasses recursively.

## Handling Cycles 

Recursive data structures (like a `Node` pointing to another `Node`) cause infinite recursion at compile-time because the compiler tries to generate a `GenCodec[Node]` while it's still in the middle of generating a `GenCodec[Node]`.

To break this cycle, we introduce a `Deferred` wrapper. We place it in the implicit scope *before* we start the derivation process:

```scala 3
final class Deferred[T] extends GenCodec[T]:
  var underlying: GenCodec[T] = null.asInstanceOf[GenCodec[T]]

  def read(input: Input): T = underlying.read(input)
  def write(output: Output, value: T): Unit = underlying.write(output, value)

inline def derived[T]: GenCodec[T] =
  given deferred: Deferred[T] = new Deferred[T]

  val underlying = unsafeDerived[T] // our renamed old 'derived'
  deferred.underlying = underlying
  underlying
```

The `given deferred: Deferred[T]` makes the instance available during the derivation of `T` itself.
When the compiler encounters a field of type `T` (the recursive step), it will find this `given` instead of trying to call `derived[T]` again.
Later, we fill in the `underlying` field with the fully constructed codec.
This works because we use a `var` - the instance is "lazily" completed after the skeleton is created.

## The "Almost" Part

Sometimes we need to derive codecs for singleton types (like `object` instances). For individual values, we can use the `ValueOf` type class.
The `ValueOf[T]` gives us the runtime value of a singleton type. But how do we get its name? For that, we need our first "real" macro.

### Type Names via Opaque Types

When `Mirror` isn't available (e.g., for primitives or singletons), we still need the type's name for serialization.

We use an opaque type to carry the type name without runtime overhead:

```scala 3
opaque type TypeName[T] <: String = String

object TypeName:
  inline given [T] => TypeName[T] = ${ deriveImpl[T] }

  private def deriveImpl[T: Type](using quotes: Quotes): Expr[TypeName[T]] =
    import quotes.reflect.*
    Expr(TypeRepr.of[T].show)
```

This macro extracts the fully-qualified type name at compile-time and encodes it as a string literal.
The `opaque type` ensures it's treated distinctly from `String` for type safety, but at runtime it's just a string.

Finally, we integrate this into our `unsafeDerived` method:

```scala 3
inline private def unsafeDerived[T]: GenCodec[T] = compiletime.summonFrom:
    case m: Mirror.Of[T] => // as before
    case v: ValueOf[T] =>
      deriveSingleton(compiletime.summonInline[TypeName[T]], v.value)
    case _ => compiletime.error("Cannot derive GenCodec")
```

### Handling Annotations

Scala 2 `scala-commons `supported custom names via an `@name` annotation.
We use Scala 3's `RefiningAnnotation` which are more "sticky" than normal ones. They are conceptually kept around when normal refinements would also not be stripped away.
A small macro helps us check for the presence of an annotation at compile-time:

```scala 3
class name(val value: String) extends RefiningAnnotation

@implicitNotFound("${T} is not annotated with ${A}")
opaque type HasAnnotation[T, A <: RefiningAnnotation] = A

object HasAnnotation:
  extension [T, A <: RefiningAnnotation](has: HasAnnotation[T, A]) def value: A = has

  inline given [T, A <: RefiningAnnotation] => HasAnnotation[T, A] = ${ materializeImpl[T, A] }

  private def materializeImpl[T: Type, A <: RefiningAnnotation: Type](using quotes: Quotes): Expr[HasAnnotation[T, A]] =
    import quotes.reflect.*
    TypeRepr.of[T].typeSymbol.getAnnotation(TypeRepr.of[A].typeSymbol) match
      case Some(annot) => annot.asExprOf[A]
      case _ => report.errorAndAbort(s"${Type.show[T]} is not annotated with ${Type.show[A]}")
```

If a type has the annotation, `HasAnnotation[T, A]` gives us the annotation object itself.
If not, the macro aborts at compile-time with a clear error.

By combining `HasAnnotation` with `summonFrom`, we can check for annotations and fall back to defaults:

```scala 3
class name(val value: String) extends scala.annotation.RefiningAnnotation

inline private def constName[T](inline fallback: String) = compiletime.summonFrom:
  case h: HasAnnotation[T, `name`] => h.value
  case _ => fallback
```

The backticks around `name` are crucial - they tell the compiler to treat `name` as a type name, not a type binding.
Without them, the compiler would think `name` is a variable in scope, leading to errors.

For field names, we need to check each field's type separately:

```scala 3
inline private def constNames[Tup <: Tuple]: Tuple = inline compiletime.erasedValue[Tup] match
    case _: ((label, tpe) *: tail) =>
      val head = constName[tpe](compiletime.constValue[label].asInstanceOf[String])
      head *: constNames[tail]
    case _: EmptyTuple => EmptyTuple
```

We zip labels with types, then for each field, check if its type has a `@name` annotation. If yes, use that; otherwise use the label.

Now integrate this into `unsafeDerived`:

```scala 3
inline private def unsafeDerived[T]: GenCodec[T] = compiletime.summonFrom:
  case m: Mirror.Of[T] =>
    val typeName = constName[T](compiletime.constValue[m.MirroredLabel])
    val fieldNames = constNames[Tuple.Zip[m.MirroredElemLabels, m.MirroredElemTypes]].toArray.map(_.asInstanceOf[String])

    // ... as before, using typeName and fieldNames
  case v: ValueOf[T] =>
    val typeName = constName[T](compiletime.summonInline[TypeName[T]])
    deriveSingleton(typeName, v.value)
  case _ => compiletime.error("Cannot derive GenCodec")
```

## Summary

We've moved from 1,200 lines of complex reflection to a few dozen lines of type-safe, compile-time Scala 3 code.
While we still use macros for annotation processing, the "heavy lifting" is now handled by the compiler's native understanding
of types.

I'm defending my bachelor's thesis the day after tomorrow. I hope I won't stop blogging after that. If you enjoyed this post, consider following me on [LinkedIn](https://www.linkedin.com/in/halotukozak/) for updates on future content!
