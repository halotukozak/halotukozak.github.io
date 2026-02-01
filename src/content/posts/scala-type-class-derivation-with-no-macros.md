---
title: 'Scala Type Class Derivation with (almost) no macros'
published: 2026-02-01
draft: true
tags: [ 'scala', 'type class', 'compile-time' ]
toc: true
---

## Boilerplate in Type Class Instances

In the Scala 2 era, type class derivation was often a "dark art." If you wanted to automate something like
serialization—take the `scala-commons` library's `GenCodec` as an example—you usually had to wrestle with the Reflection
API. We’re talking about roughly **1,200 lines of low-level code** just to handle the boilerplate of peering into class
structures.

With Scala 3, we can achieve the same (and more) using the `Mirror` API and `scala.compiletime` utilities. 
We still need a *tiny* bit of macro magic for annotations, but we can get 95% of the way there with standard code.

## The Foundation: GenCodec

We assume a robust serialization API already exists. Our goal isn't to write the serializer itself, but to automate instance creation for complex types.

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

  // Internal "low-level" derivation methods we'll be calling:
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

Scala 3 introduces `Mirror`, a compile-time representation of a class's structure that lets us decompose types into their components.

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

### What's happening here?

**compiletime.summonFrom** is a compile-time conditional that pattern matches on available givens. 
It tries each case in order and uses the first one that works.

**compiletime.constValue** extracts a literal value (like a String `"Node"`) from the type level to the value level. 
At compile-time, `m.MirroredLabel` is a singleton type containing the class name as a string—`constValue` materializes it.

**compiletime.constValueTuple** converts a tuple of types into a tuple of values. 
For example, field labels (which exist as a tuple of singleton string types) become actual `String` values.

**Tuple.Map** is a type-level operation that transforms a tuple of types. 
If you have `(Int, String, Boolean)` and apply `Tuple.Map[..., GenCodec]`, you get `(GenCodec[Int], GenCodec[String], GenCodec[Boolean])`.

> **Note on asInstanceOf**: We use `.toArray.map(_.asInstanceOf[GenCodec[?]])` instead of a direct cast to `.asInstanceOf[Array[GenCodec[?]]]`.

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

**compiletime.erasedValue** lets us pattern match on a type without having a runtime value.
It's a no-op at runtime but at compile-time tells the compiler "I know this type's structure."

**inline match** ensures the pattern matching is fully expanded at compile-time. 
Each case is either eliminated or evaluated before any code is generated.

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

Recursive data structures (like a `Node` pointing to another `Node`) cause infinite recursion at compile-time.
To break the cycle, we introduce a `Deferred` wrapper and place it in scope *before* deriving:

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

The `given Deferred[T]` makes the instance available during the derivation of `T` itself.
When the compiler tries to derive `T`, it will first summon the `Deferred[T]` (breaking the recursion), then later fill in its `underlying` field with the complete instance.
This pattern works because we use `var`—the instance can be mutated after creation.

## The "Almost" Part

Sometimes we need more than what `Mirror` provides — like the actual name of a type or handling custom annotations like the one that changes serialization names.
[//]: # (- we can derive not only for sum and product, but also for singleton
[//]: # (- explain ValudOf
[//]: # (- but how to get name?
[//]: # (- explain this macro)

```scala 3
inline private def unsafeDerived[T]: GenCodec[T] = compiletime.summonFrom:
    case m: Mirror.Of[T] => // as before
    case v: ValueOf[T] =>
      deriveSingleton(compiletime.summonInline[TypeName[T]], v.value)
    case _ => compiletime.error("Cannot derive GenCodec")
```

[//]: # (todo: but how to get name?)

### Type Names via Opaque Types
[//]: # (add into)

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

[//]: # (todo: gencodec library provides some annotation handling - we can do it too)
[//]: # (explain that we want to have custom naming via @name annotation
[//]: # (explain that we can use RefningAnnotation for that
[//]: # (show code)
### Handling Annotations

We want to support custom naming via an `@name` annotation. To detect and extract it at compile-time, we use `RefiningAnnotation` and a small macro:

```scala 3
class name(val value: String) extends scala.annotation.RefiningAnnotation

@implicitNotFound("${T} is not annotated with ${A}")
opaque type HasAnnotation[T, A <: RefiningAnnotation] <: A = A

object HasAnnotation:
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

The backticks around `name` are crucial—they tell the compiler to treat `name` as a type name, not a type binding.
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

We've moved from 1,200 lines of complex reflection to a few dozen lines of type-safe, compile-time Scala 3 code. While
we still use macros for annotation processing, the "heavy lifting" is now handled by the compiler's native understanding
of types.

I'm defencing my bachelor's thesis the day after tomorrow. Wish me luck!
