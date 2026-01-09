---
title: 'Access Scala Method Defaults'
published: 2026-01-10
draft: false
tags: [ 'scala', 'macro' ]
toc: true
---

## The Problem: Hidden Defaults

Someone [asked on the Scala contributors forum](https://contributors.scala-lang.org/t/how-to-avoid-repeating-method-parameter-defaults/7330)
how to access method parameter defaults.

Default parameters are convenient syntax sugar—but sometimes you need to access them programmatically. Imagine you're
building a configuration builder and want to include the default values in help
text:

```scala
case class Database(host: String = "localhost", port: Int = 5432, name: String = "mydb")

// You want to generate documentation:
// "host" (default: localhost)
// "port" (default: 5432)
// "name" (default: mydb)
```

The JVM doesn't natively store default parameters in method signatures at runtime. Scala has a trick—it generates hidden
methods—but you can't access them without macros.

We'd like to pass a method reference and get back a `Map[String, Any]` containing all parameter defaults.

```scala
@main
def main(): Unit =
  assert(defaults(method) == Map("x" -> 10, "y" -> "two"))

def method(x: Int = 10, y: String = "two") = ???
```

## Prerequisites

I assume you're comfortable with Scala and have some familiarity with Scala 3 macros. If you need a refresher on Scala 3
macros, I recommend [this Software Mill article](https://softwaremill.com/scala-3-macros-tips-and-tricks/) first.

I use Scala 3.8.0-RC4 for this example.

## How Scala Encodes Defaults

The JVM doesn't natively support default parameters. Scala gets creative. When you define a method with defaults, the
compiler generates companion methods in the class for each defaulted parameter. These methods are named with a special
encoding: `$default$N,` where `N` is the parameter position (1-indexed).

So `def method(x: Int = 10, y: String = "two") = ???` actually creates:

[//]: # (@formatter:off)
```java
//
// Source code recreated by IntelliJ IDEA
// (powered by FernFlower decompiler)
//
//decompiled from main$package$.class
import java.io.Serializable;
import scala.runtime.Nothing;
import scala.runtime.Scala3RunTime.;

public final class main$package$ implements Serializable {
    // ... other generated code ...

    public Nothing method(final int x, final String y) {
        return scala.Predef..MODULE$.$qmark$qmark$qmark();
    }

    public int method$default$1() {
        return 10;
    }

    public String method$default$2() {
        return "two";
    }
}
```
[//]: # (@formatter:on)

Scala compiler on call site generates calls to these `$default$N` methods when parameters are omitted.

## Step 1: Simple Version (Map-Based)

Let's move to the code. We will use the `quotes.reflect` to look under the hood of the method definition at compile
time. Our macro does three things:

1. Extracts the symbol of method we're analyzing
2. Find all generated `$default$N` methods.
3. Builds a map connecting parameter names to their default values

Here's the code with detailed comments:

[//]: # (@formatter:off)
```scala
inline def defaults[T](inline fun: T): Map[String, Any] = ${ defaultsImpl('{ fun }) }

def defaultsImpl[T: Type](expr: Expr[T])(using quotes: Quotes): Expr[Map[String, Any]] =
  import quotes.reflect.*
  
  // Extract the method reference from the inline parameter
  // Lambda(...) = the anonymous function wrapper, Apply(...) = the function call
  val Lambda(_, Apply(method, _)) = expr
    .asTerm                                     // convert Expr[?] to the Reflection Term
    .underlying                                 // get the real method behind the inline wrapper
    .runtimeChecked                             // disable the exhaustiveness check (we assume happy path here)
  
  // Get the method's symbol (compile-time metadata about the method)
  val methodSymbol = method.symbol
  
  
  // Collect all parameter names in order
  val paramNames = methodSymbol.paramSymss // "parameter symbol sequences" (handles grouped parameters)
    .flatten                               //combine all groups into one list
    .map(_.name)                           //extract just the names
    .toVector                              //convert to Vector for indexed access (we need positions later)
  
  // Build the prefix for hidden default methods
  val prefix = methodSymbol.name + "$default$"
  
  // Find all hidden default methods and map them to parameter names
  val defaults = methodSymbol.owner.methodMembers
    .collect:
      case m if m.name.startsWith(prefix) =>            // Only collect methods starting with our prefix (e.g., "greet$default$1")
        val position = m.name.stripPrefix(prefix).toInt // Extract the position number
        paramNames(position - 1)-> Ref(m).              // Ref(m) creates an expression that can call this method at runtime
    
    // Convert each (paramName, methodRef) pair to an expression tuple
    // This prepares them for splicing into the macro result
    .map: (k, v) =>
      Expr.ofTuple((Expr(k), v.asExpr)) //Expr lifts String into Expr[String], asExpr converts Term to Expr[?]

  // Varargs(...) converts List[Expr[T]] to Expr[List[T]]
  '{ ${ Varargs(defaults) }.toMap }
```
[//]: # (@formatter:on)

### Testing the First Version

[//]: # (@formatter:off)
```scala
def greet(name: String = "samsepi0l", number: Int = 43) = s"$greeting $number"

@main
def main(): Unit =
  val d = defaults(greet)
  println(d) // Map("name" -> "samsepi0l", "number" -> "43")

  // Access via string key (but no type safety)
  val name = d("name")
  val number: Int = d("number").asInstanceOf[Int] // type is Any, must cast
```
[//]: # (@formatter:on)

## Why We Need Better: Type-Safety

Our first solution works, but it has drawbacks: we can get a runtime error when key does not exist and the type of value
is always `Any`.

## Step 2: Type-Safe Version with Computed Field Names

### What is `Selectable`?

`Selectable` is a trait that enables dynamic access to the refined fields.
The `selectDynamic` method takes a field name and returns the value associated with that name.

[//]: # (@formatter:off)
```scala
class DynamicConfig extends Selectable:
  val x = 10
  val y = "hello"

  def selectDynamic(name: String): Any = name match
    case "x" => x
    case "y" => y
    case _ => throw new NoSuchFieldException(s"No such field: $name")

import scala.reflect.Selectable.reflectiveSelectable

val d: Selectable { val x: Int; val y: String; def selectDynamic(name: String): Any } = new DynamicConfig
val x: Int = d.x    // works
val y: String = d.y // works
val z = d.z         // compile error: no z field
```
[//]: # (@formatter:on)

This solution is type-safe because the compiler knows the types of `x` and `y` at compile time, but it requires us to
import implicit conversion that turns a value into a `Selectable` such that structural selections are performed on that
value.

### What are `Computed Field Names`?

The `Selectable` trait now can have a `Fields` type member that can be instantiated to a named tuple.

```scala
trait Selectable:
  type Fields <: NamedTuple.AnyNamedTuple
```

If `Fields` is instantiated in a subclass of `Selectable` to some named tuple type, then the available fields and their
types will be defined by that type. For example, if `Fields` is defined as `(x: Int, y: String)`, then the `Selectable`
instance will have fields `x` of
type `Int` and `y` of type `String`.

[//]: # (@formatter:off)
```scala
class DynamicConfig extends Selectable:
  type Fields = (x: Int, y: String)
  
  private val data = Map("x" -> 10, "y" -> "hello")
  
  def selectDynamic(name: String): Any = data(name)

val d = new DynamicConfig
val x: Int = d.x      // works
val y: String = d.y   // works
// val z = d.z        // compile error: no z field
```
[//]: # (@formatter:on)

## The Type-Safe Implementation

We're gonna enhance our macro to build a `Fields` type member that is a named tuple of parameter names and types.

Example: for `method(x: Int = 10, y: String = "hi")` names should become: `("x", "y")`, types should become:
`(Int, String)`.

The result should be `(x: Int, y: String)` (which is a syntax sugar for `NamedTuple[("x", "y"), (Int, String)]`).

[//]: # (@formatter:off)
```scala
import scala.NamedTuple.{AnyNamedTuple, NamedTuple}
import scala.quoted.*

// 'transparent' is key: type information flows through to the caller
// Without it, type refinements would be hidden inside the return type
transparent inline def defaults[T](inline fun: T): DefaultsExtractor = 
  ${ defaultsImpl('{ fun }) }

def defaultsImpl[T: Type](expr: Expr[T])(using quotes: Quotes): Expr[DefaultsExtractor] =
  import quotes.reflect.*
  
  // Extract method symbol (same as before)
  val Lambda(_, Apply(method, _)) = expr.asTerm.underlying.runtimeChecked
  val methodSymbol = method.symbol
  val prefix = methodSymbol.name + "$default$"
  val paramNames = methodSymbol.paramSymss.flatten.map(_.name).toVector

  // Build runtime map (same as before)
  val defaults = methodSymbol.owner.methodMembers
    .collect:
      case m if m.name.startsWith(prefix) =>
        paramNames(m.name.stripPrefix(prefix).toInt - 1) -> Ref(m)

  // Convert to expression that builds a Map at runtime
  val defaultsExpr =
    val list = Expr.ofSeq:
      defaults.map: (name, term) =>
        Expr.ofTuple((Expr(name), term.asExpr))
        
    '{ $list.toMap }

  val fieldsType = TypeRepr
    .of[NamedTuple]
    .appliedTo:
      defaults
        // Start with empty tuples: () and ()
        .foldLeft((TypeRepr.of[EmptyTuple], TypeRepr.of[EmptyTuple])):
          case ((accNames, accTypes), (paramName, term)) =>
            // For each (paramName, defaultMethod) pair, build up both tuples
            
            // Build the names tuple by cons-ing the parameter name. *: is Scala's tuple cons operator (like :: for lists at type level)
            val newNames = TypeRepr.of[*:].appliedTo(List(
              ConstantType(StringConstant(paramName)), // convert a string to a type
              accNames                                 // previously accumulated names
            ))
            
            //Similarly for types
            val newTypes = TypeRepr.of[*:].appliedTo(List(
              term.tpe,                               // the type of the default value's expression
              accTypes                                // previously accumulated types
            ))
            
            (newNames, newTypes)
        // After the fold, convert the (names, types) pair to a List
        // for passing to .appliedTo
        .toList

  // Pattern match to "escape" the type into the macro's context
  // asType match converts TypeRepr to a compile-time Type
  fieldsType.asType match
      // Pattern introduces a type variable 'fields' capturing what we built (with bounds to AnyNamedTuple)
    case '[ type fields <: AnyNamedTuple; fields ] =>
      '{
        new DefaultsExtractor($defaultsExpr):
          type Fields = fields  // Refine the abstract type to our computed one
      }

// The extractor class that makes everything work
sealed class DefaultsExtractor(defaults: Map[String, Any]) extends Selectable:
  // This type member will be refined by each macro invocation
  // to the exact NamedTuple of defaults for that specific method
  type Fields <: AnyNamedTuple

  // The magic method: enables d.x, d.y syntax
  // When you write d.x, the compiler expands it to:
  // selectDynamic("x").asInstanceOf[T]
  // where T is the type of "x" from the Fields type member
  final def selectDynamic(name: String): Any = defaults(name)
```
[//]: # (@formatter:on)

### Why `transparent inline def`?

The `transparent` keyword means the inline function doesn't create a type boundary. Type refinements (the
`type Fields = ...` part) flow through to the caller's context. Without it, the detailed field information would be
hidden inside the `DefaultsExtractor`'s type, and callers couldn't see which fields are available.

## Edge Cases & Production Considerations

This implementation handles the happy path. It may crash on varargs, implicits, nested functions or in combination with
access modifiers.

## Case closed

You can get the code on [GitHub](https://gist.github.com/halotukozak/a5e439309b3c2d010d93f38d9fd3eec7).
Back to sleep now. Would you like me to write something here again?

## References

- [Scala 3 Macro Documentation](https://docs.scala-lang.org/scala3/reference/metaprogramming/macros.html)
- [Named Tuples](https://docs.scala-lang.org/scala3/reference/other-new-features/named-tuples.html)
- [Computed Field Names](https://docs.scala-lang.org/scala3/reference/other-new-features/named-tuples.html#computed-field-names)
- [Selectable Trait](https://scala-lang.org/api/3.x/scala/Selectable.html)
- [Original Forum Post](https://contributors.scala-lang.org/t/how-to-avoid-repeating-method-parameter-defaults/7330)
