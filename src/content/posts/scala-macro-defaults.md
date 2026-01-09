---
title: 'Access Scala Method Defaults'
published: # todo
draft: true
tags: [ 'scala', 'macro' ]
toc: true
---

Someone [asked on the
Scala contributors forum](https://contributors.scala-lang.org/t/how-to-avoid-repeating-method-parameter-defaults/7330)
how to access method parameter defaults. Why is this useful? For example, if you're building a builder pattern or
dependency injection framework, you need to know the default parameter values—the JVM doesn't store them at runtime, so
you need macros to extract them. During my BSc thesis, I've learned enough to draft an answer in two hours, so let's
build this together.

I assume you know Scala macros at minimal level. If not, I again
recommend [this Software Mill article](https://softwaremill.com/scala-3-macros-tips-and-tricks/).

I use Scala 3.8.0-RC1 for this example. Let's start with what we want: a way to extract the map of defaults from any
method.

```scala
@main
def main(): Unit =
  assert(defaults(method) == Map("x" -> 10, "y" -> "two"))

def method(x: Int = 10, y: String = "two") = ???
```

So we pass a method reference and get back a `Map[String, Any]` containing all parameter defaults.

But first: how does Scala encode defaults?

The JVM doesn't natively support default parameters. Scala gets creative. When you define a method with defaults, the
compiler generates companion methods in the class for each defaulted parameter. These methods are named with a special
encoding: `$default$N,` where `N` is the parameter position (1-indexed).

So `def method(x: Int = 10, y: String = "two") = ???` actually creates:

[//]: # @formatter:off
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
[//]: # @formatter:on

Scala compiler on call site generates calls to these `$default$N` methods when parameters are omitted.
Let's move to the code. We will use the `quotes.reflect` to look under the hood of the method definition at compile
time. Firstly, we extract the reference to the actual method via `Lambda` and `Apply` patterns. We call `.underlying` to
access the actual method behind the inline wrapper. We also call `.runtimeChecked` to handle potential edge cases
safely.

A disclaimer: we handle only the happy case here. Production code would need more guards and edge cases.

Here's what we need to extract:

The method symbol and its parameter names

All the `$default$N` methods in the owner (class)

A mapping from parameter names to their default value expressions

[//]: # @formatter:off
```scala
inline def defaults[T](inline fun: T): Map[String, Any] = ${ defaultsImpl('{ fun }) }

def defaultsImpl[T: Type](expr: Expr[T])(using quotes: Quotes): Expr[Map[String, Any]] =
  import quotes.reflect.*
  // Extract the method reference from the inline parameter
  // Lambda(...) = anonymous function, Apply(...) = function call
  // .underlying gets the real method behind the inline wrapper
  // .runtimeChecked disables the exhaustiveness check (we assume happy path here)
  val Lambda(_, Apply(method, _)) = expr.asTerm.underlying.runtimeChecked
  
  // Get the method's symbol (metadata about the method)
  val methodSymbol = method.symbol
  
  // Collect all parameter names in order
  val paramNames = methodSymbol.paramSymss   // paramSymss = parameter symbol sequences, .flatten = combine all groups
    .flatten.map(_.name)                     // .map(_.name) = extract just the names
    .toVector                                // .toVector = allows indexed access (we need positions for $default$N lookup)
  
  // Build the prefix for hidden default methods: "<method name>$default$"
  val prefix = methodSymbol.name + "$default$"
  
  // Find all hidden default methods and map them to parameter names
  val defaults = methodSymbol.owner.methodMembers
    .collect:
      case m if m.name.startsWith(prefix) => // Only collect methods starting with our prefix
        // Extract position eg. "method$default$2" -> "1" and create a reference to the method
        paramNames(m.name.stripPrefix(prefix).toInt - 1) -> Ref(m)
    .map: (k, v) =>
      // Convert each (paramName, methodRef) pair to an expression
      Expr.ofTuple((Expr(k), v.asExpr))

  // Fold into a runtime Map
  // Varargs(...) converts `List[Expr[X]]` to `Expr[List[X]]`, .toMap combines them
  '{ ${ Varargs(defaults) }.toMap }
```
[//]: # @formatter:on

Let's unpack this:

Getting parameter names: `methodSymbol.paramSymss.flatten.map(_.name)` collects all param names. We convert to a vector
for indexing—defaults use 1-indexed positions, and we need quick access.

Finding defaults: we iterate through `methodSymbol.owner.methodMembers`, collecting methods whose names start with
our `$default$` prefix. We strip the prefix, parse the 1-indexed number, and use it to look up the actual parameter
name.
`Ref(m)` gives us a reference to the default method—essentially "a way to call this method at runtime."

Building the map: `Expr.ofTuple` wraps each (name, method reference) pair as an expression. The `Varargs(...)`
constructor
spreads these tuples into varargs, which we then fold into a map.

This works, but we can do better. We can leverage Scala's type system to get type-safe access to defaults.

Enter Selectable and NamedTuple

What is `Selectable`?

`Selectable` is a trait enabling dynamic field access. With [Computed Field Names](https://docs.scala-lang.org/scala3/reference/other-new-features/named-tuples.html#:~:text=Computed%20Field%20Names) it enables compile-time type checking and safe access:

```scala
class DynamicConfig extends Selectable:
  type Fields = (x: 10, y: "hi")
  private val data = Map("x" -> 10, "y" -> "hi")
  def selectDynamic(name: String): Any = data(name)

val c = new DynamicConfig
c.x  // Calls selectDynamic("x") at runtime
````


Here's the upgraded version:
  
[//]: # @formatter:off
```scala
import scala.NamedTuple.{AnyNamedTuple, NamedTuple}
import scala.quoted.*

// 'transparent' is key: type information flows through to the caller
transparent inline def defaults[T](inline fun: T): DefaultsExtractor = ${ defaultsImpl('{ fun }) }

def defaultsImpl[T: Type](expr: Expr[T])(using quotes: Quotes): Expr[DefaultsExtractor] =
  import quotes.reflect.*
  val Lambda(_, Apply(method, _)) = expr.asTerm.underlying.runtimeChecked
  val methodSymbol = method.symbol
  val prefix = methodSymbol.name + "$default$"

  val paramNames = methodSymbol.paramSymss.flatten.map(_.name).toVector

  val defaults = methodSymbol.owner.methodMembers
    .collect:
      case m if m.name.startsWith(prefix) =>
        paramNames(m.name.stripPrefix(prefix).toInt - 1) -> Ref(m)

  val defaultsExpr =
    val list = Expr.ofSeq:
      defaults.map: (name, term) =>
        Expr.ofTuple((Expr(name), term.asExpr))

    '{ $list.toMap }


  // Combine into a NamedTuple type representing (x = Int, y = String)
  val fieldsType = TypeRepr
    .of[NamedTuple]
    .appliedTo:
      defaults
        .foldLeft((TypeRepr.of[EmptyTuple], TypeRepr.of[EmptyTuple])):
          case ((names, types), (name, term)) =>
            (
              // Add the parameter name as a type-level string constant
              TypeRepr.of[*:].appliedTo(List(ConstantType(StringConstant(name)), names)),
              // Add the actual type of this default value
              TypeRepr.of[*:].appliedTo(List(term.tpe, types)),
            )
        // convert a tuple to the list
        .toList

  // Pattern match to "escape" the type into the macro return context
  // asType match converts TypeRepr to Type, on which we can pattern match
  fieldsType.asType match
    case '[ type fields <: AnyNamedTuple; fields ] =>
      '{
        new DefaultsExtractor($defaultsExpr):
          type Fields = fields
      }

sealed class DefaultsExtractor(defaults: Map[String, Any]) extends Selectable:
  type Fields <: AnyNamedTuple

  final def selectDynamic(name: String): Any = defaults(name)
```
[//]: # @formatter:on

What changed?

We construct a runtime map exactly as before. But now we also construct a type-level representation of the defaults.
This lets us encode which defaults are available and their types at compile time.

We fold over our defaults to build a tuple type. For each `(name, term)` pair, we create tuple types using
`TypeRepr.of[*:].appliedTo(...)`. The names become a tuple of string constants; the types become a tuple of actual
types. Finally, we apply both to NamedTuple to get a heterogeneous record type.

We pattern match on the result with asType to escape the pattern into the macro's type context. This gives us fields—a
concrete type capturing all defaults and their types.

The `DefaultsExtractor` class extends `Selectable`, which enables the `selectDynamic` method. This means you can write
defaults.x or defaults.y and get type-safe access.

Why transparent inline def?

`transparent` is crucial. It means the inline def doesn't create a new type boundary—the return type is transparent to
type refinement. Combined with the type member `Fields`, this lets callers see the exact default field names and types
at compile time. Without it, the type information stays hidden inside the extractor.

This is metaprogramming at its finest: runtime behavior coupled with compile-time type precision.es us the ability to
have type members depending on the inline parameters.

Results:

```scala
val d = defaults(method)
val x: Int = d.x // works and has type Int
val y: String = d.y // works and has type String
// d.z               // compiler error: no such field
```