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

With Scala 3, we can achieve the same (and more) using the `Mirror` API and `scala.compiletime` utilities. We still need
a *tiny* bit of macro magic for annotations, but we can get 95% of the way there with standard code.

## The Foundation: GenCodec

We assume we already have a robust serialization API. Our goal isn't to write the serializer itself, but to automate its
creation for complex types.

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

Scala 3 introduces `Mirror`, a type-level representation of a class's structure.

* **Mirror.ProductOf[T]**: For case classes and tuples.
* **Mirror.SumOf[T]**: For enums and sealed traits.

Our first attempt at a `derived` method looks like this:

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

1. `compiletime.summonFrom`: A compile-time conditional that allows us to pattern match on givens. It will evaluate the
   first case which given is available.
2. `compiletime.constValue`: Extracts a literal value (like a class name) from a type level to the value level.
3. `compiletime.constValueTuple`: Converts a tuple of types (like field labels) into a tuple of values.
4. `Tuple.Map`: A type-level operation that transforms a tuple `(A, B)` into `(GenCodec[A], GenCodec[B])`.

> **Note:** You might wonder why we use `.toArray.map(_.asInstanceOf[GenCodec[?]])` instead of a direct cast. Because of
> JVM type erasure and how generic arrays are handled, a direct cast to `Array[GenCodec[?]]` would fail at runtime. We
> have to map over the elements to satisfy the compiler.

[//]: # todo( brakuje mi więcej opisu kodu)

## Recursive Derivation

The simple version works for structures where all subclasses and fields have existing `GenCodec` instances.
But we don't want to require users to manually define codecs for every subtype, because can derive them recursively.

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

      (elemCodec *: summonInstances[elems](summonAllowed, deriveAllowed)).asInstanceOf[Tuple.Map[Elems, GenCodec]]
    case _: EmptyTuple => EmptyTuple.asInstanceOf[Tuple.Map[Elems, GenCodec]]
```

* `compiletime.erasedValue`: Allows us to pattern match on the structure of a type without having a runtime value.
* `inline match`: Ensures the logic is expanded and resolved at compile-time.


```scala 3
inline private def derived[T]: GenCodec[T] = compiletime.summonFrom:
    case m: Mirror.Of[T] =>
      val typeName = compiletime.constValue[m.MirroredLabel]
      val fieldNames = compiletime.constValueTuple[m.MirroredElemLabels].toArray.map(_.asInstanceOf[String])

      m match
        case m: Mirror.ProductOf[T] => 
          val instances =summonInstances[m.MirroredElemTypes](summonAllowed = true, deriveAllowed = false).toArray.map(_.asInstanceOf[GenCodec[?]])
          deriveProduct(typeName, instances, fieldNames)
        case m: Mirror.SumOf[T] =>
          val instances =summonInstances[m.MirroredElemTypes](summonAllowed = true, deriveAllowed = true).toArray.map(_.asInstanceOf[GenCodec[?]])
          val classes = compiletime
            .summonAll[Tuple.Map[m.MirroredElemTypes, ClassTag]]
            .toArray
            .map(_.asInstanceOf[ClassTag[?]].runtimeClass)

          deriveSum(typeName, instances, fieldNames, classes)
    case _ => compiletime.error("Cannot derive GenCodec")
```

## Handling Cycles 

Recursive data structures (like a `Node` pointing to another `Node`) will cause infinite recursion at compile-time. 
To handle this, we use a `Deferred` wrapper to break the cycle.

```scala 3
final class Deferred[T] extends GenCodec[T]:
  var underlying: GenCodec[T] = null.asInstanceOf[GenCodec[T]]

  def read(input: Input): T = underlying.read(input)
  def write(output: Output, value: T): Unit = underlying.write(output, value)

inline def derived[T]: GenCodec[T] =
  given deferred: Deferred[T] = new Deferred[T]

  val underlying = unsafeDerived[T] // we call renamed our old 'derived'
  deferred.underlying = underlying
  underlying
```

[//]: # todo: - note we can firstly check cycles and only then create Deferred instances() but not now

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

[//]: # (into)

We use an `opaque type` to carry the type name without the runtime overhead, resolved via a tiny macro.

```scala 3
opaque type TypeName[T] <: String = String

object TypeName:
  inline given [T] => TypeName[T] = ${ deriveImpl[T] }

  private def deriveImpl[T: Type](using quotes: Quotes): Expr[TypeName[T]] =
    import quotes.reflect.*
    Expr(TypeRepr.of[T].show)
```

### Handling Annotations

[//]: # (todo: gencodec library provides some annotation handling - we can do it too)
[//]: # (explain that we want to have custom naming via @name annotation
[//]: # (explain that we can use RefningAnnotation for that
[//]: # (show code)
To support custom naming via `@name`, we use `RefiningAnnotation` and a macro to check for its presence.

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

By combining `HasAnnotation` with `summonFrom`, we can prioritize the annotated name over the default class name:

```scala 3
class name(val value: String) extends scala.annotation.RefiningAnnotation

inline private def constName[T](inline fallback: String) = compiletime.summonFrom:
  case h: HasAnnotation[tpe, `name`] => h.value
  case _ => fallback
  
  inline private def constNames[Tup <: Tuple]: Tuple = inline compiletime.erasedValue[Tup] match
    case _: ((label, tpe) *: tail) =>
      val head = constName(compiletime.constValue[label].asInstanceOf[String])
      head *: constNames[tail]
    case _: EmptyTuple => EmptyTuple
```

```scala 3
inline private def unsafeDerived[T]: GenCodec[T] = compiletime.summonFrom:
  case m: Mirror.Of[T] =>
    val typeName = constName(compiletime.constValue[m.MirroredLabel])
    val fieldNames = constNames[Tuple.Zip[m.MirroredElemLabels, m.MirroredElemTypes]].toArray.map(_.asInstanceOf[String])

   //.. as previous
  case v: ValueOf[T] =>
    val typeName = constName(compiletime.summonInline[TypeName[T]])
    deriveSingleton(typeName, v.value)
  case _ => compiletime.error("Cannot derive GenCodec")
```

[//]: # (tood: - note that name type is in backtics)
[//]: # (tood: - explain scala.annotation.RefiningAnnotation)

## Summary

We've moved from 1,200 lines of complex reflection to a few dozen lines of type-safe, compile-time Scala 3 code. While
we still use macros for annotation processing, the "heavy lifting" is now handled by the compiler's native understanding
of types.

[//]: # (pojutrze obrona inżynierki, wish me luck)