---
title: 'Scala Type Class Derivation with (almost) no macros'
published: 2026-02-01
draft: true
tags: [ 'scala', 'type class', 'compile-time' ]
toc: true
---

- there is scala-commons library for Scala 2 with macro-based type class derivation for GenCodec serialization, so we already have the implemention of codecs with class like 
- we won't focus on serialization implementation here
- scala 2 has reflection api machinery for about 1200 lines of low-level code
- we assume we have exposed and ready api like this:
- expalantion what is singleton, sum (nested vs flatterned), product and transparent types. Tell what is mirror

```scala 3
trait GenCodec[T]:
  def read(input: Input): T

  def write(output: Output, value: T): Unit

object GenCodec:
  given GenCodec[Boolean] = ???

  given GenCodec[Char] = ???

  given GenCodec[Byte] = ???
  // ... other basic types

  given [C[X] <: Seq[X], T: GenCodec] => GenCodec[C[T]] = ???
  // ... other collections

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

  private def deriveTransparent[T, O](
    wrapped: GenCodec[O],
    onWrite: T => O,
    onRead: O => T,
  ): GenCodec[T] = ???
```

- what is compiletime.summonFrom

- we start with derivation for products and singletons
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

- explanation in code what is:
  - compiletime.constValue
  - compiletime.constValueTuple
  - Tuple.Map

- disclaimaer why we need to .toArray.map(_.asInstanceOf[GenCodec[?]]) and why .toArray.asInstanceOf[Array[GenCodec[?]]] won't work

- but we don't want to write derives GenCodec for subclasses, so
- eplain summonInstances
```scala 3
inline private def summonInstances[Elems <: Tuple](
  summonAllowed: Boolean,
  deriveAllowed: Boolean,
): Tuple =
  inline compiletime.erasedValue[Elems] match
    case _: (elem *: elems) =>
      val elemCodec = compiletime.summonFrom {
        case codec: GenCodec[`elem`] if summonAllowed => codec
        case _ if deriveAllowed => derived[elem]
      }
      (elemCodec *: summonInstances[elems](summonAllowed, deriveAllowed)).asInstanceOf[Tuple.Map[Elems, GenCodec]]
    case _: EmptyTuple => EmptyTuple.asInstanceOf[Tuple.Map[Elems, GenCodec]]
```
- explain compiletime.erasedValue
- explain inline match

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

- oh, no! recursion
- note we can detect cycles and throw error
- explain Deferred
- we renamed derived to unsafeDerived
```scala 3

final class Deferred[T] extends GenCodec[T]:
  var underlying: GenCodec[T] = null.asInstanceOf[GenCodec[T]]
  def read(input: Input): T = underlying.read(input)
  def write(output: Output, value: T): Unit = underlying.write(output, value)

inline def derived[T]: GenCodec[T] = 
  given deferred: Deferred[T] = new Deferred[T]
  val underlying = unsafeDerived[T]
  deferred.underlying = underlying
  underlying
```
- note we can firstly check cycles and only then create Deferred instances

- we can derive not only for sum and product, but also for singleton
- explain ValudOf
- but how to get name?
- explain this macro
```scala 3
opaque type TypeName[T] <: String = String
object TypeName:
  inline given [T] => TypeName[T] = ${ deriveImpl[T] }

  private def deriveImpl[T: Type](using quotes: Quotes): Expr[TypeName[T]] = 
    import quotes.reflect.*
    Expr(TypeRepr.of[T].show)
```

- eplain why we use opaque types


- now we can add new case
```scala 3
inline private def unsafeDerived[T]: GenCodec[T] = compiletime.summonFrom:
    case m: Mirror.Of[T] => // as before
    case v: ValueOf[T] =>
      deriveSingleton(compiletime.summonInline[TypeName[T]], v.value)
    case _ => compiletime.error("Cannot derive GenCodec")
```

- but there was annotaion @name. 
- let's start with HasAnnotation Macro
```scala 3
class transparent extends scala.annotation.RefiningAnnotation
```
explain RefiningAnnotation

- HasAnnotation type class
```scala 3
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


- constName
```scala 3
class name(val value: String) extends RefiningAnnotation

inline private def constName[T](inline fallback: String) = compiletime.summonFrom:
  case h: HasAnnotation[tpe,`name`] => h.value
  case _ => fallback
```
- note that name type is in backtics
- also constNames
```scala 3
inline private def constNames[Tup <: Tuple]: Tuple = inline compiletime.erasedValue[Tup] match
    case _: ((label, tpe) *: tail) =>
      val head = constName(compiletime.constValue[label].asInstanceOf[String])
      head *: constNames[tail]
    case _: EmptyTuple => EmptyTuple
```

- changed
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

- it does not cover the full functionality of scala-commons GenCodec derivation, but it is close enough.