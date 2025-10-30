---
title: 'Method too large'
published: 2025-10-30
draft: false
tags: [ 'scala', 'macro' ]
toc: true
---

# Scala 3 macro vs JVM method size limit

## It's so big

While working on my BSc thesis, I encountered a cryptic Scala compilation error: "method too large." I use macros to
generate code, I mean, a lot of code! You can think of some derivation or routing REST API generation, etc.

## What's going on?

We're gonna simplify this problem to such a long list generation, but in real case, the list creation cannot be replaced
with a simple loop since the elements are not predictable.

```scala
import scala.quoted.*

inline def someMacro[T](inline n: Int, elem: T): Seq[T] =
  ${ someMacroImpl[T]('{ n }, '{ elem }) }

def someMacroImpl[T: Type](n: Expr[Int], elem: Expr[T])(using Quotes): Expr[Seq[T]] = {
  val longList = Seq.fill(n.valueOrAbort)(elem)
  Expr.ofSeq(longList)
}

def usage = someMacro(100000, 42) // List(42, 42, 42, ..., 42)
```

I assume you have some familiarity with macros in Scala [this](https://softwaremill.com/scala-3-macros-tips-and-tricks/)
article can be helpful. But tl;dr, I generate a long list of repeated elements at compile time and then inject it into
the code.

Quick recap:

- `inline def` - Marks this as an inline method that will be expanded at compile time
- `${ ... }` - Splice syntax that invokes the macro implementation
- `'{ n }` and `'{ elem }` - Quote syntax that converts values into `Expr[T]` representations
- `Quotes` parameter - Provides the context for macro expansion
- `Expr.ofSeq` - Converts a sequence of expressions into an expression representing a sequence

When I try to compile this code, I get the following error, which is not very verbose.

```text
Error while emitting Usage$package$
Method too large: Usage$package$.main ()Lscala/collection/immutable/Seq;
one error found
```

This error occurs when a single method exceeds the JVM's limit of 64KB of bytecode. But how can we bypass this
limitation?

## Local methods translation

JVM does not support local methods directly, so Scala finds a way to compile them. Let's see how. Consider the following
Scala code:

```scala
def sth() = {
  def local() = ???

  local()
}
```

is compiled to

```java
//decompiled from Usage$package.class

import scala.runtime.Nothing;

public final class Usage$package {
    public static Nothing sth() {
        return Usage$package$.MODULE$.sth();
    }
}

//decompiled from Usage$package$.class
import java.io.Serializable;
import scala.Predef .;
import scala.runtime.ModuleSerializationProxy;
import scala.runtime.Nothing;

public final class Usage$package$ implements Serializable {
    public static final Usage$package$ MODULE$ = new Usage$package$();

    private Usage$package$() {
    }

    private Object writeReplace() {
        return new ModuleSerializationProxy(Usage$package$.class);
    }

    public Nothing sth() {
        return this.local$1();
    }

    private final Nothing local$1() {
        return .MODULE$.$qmark$qmark$qmark();
    }
}
```

As you can see, the local method `local` is compiled to a private method `local$1` of the enclosing object
`Usage$package$`.

## The chunking solution

The story goes that nine women won't give birth in a month, but since we cannot generate a large method, we can split it
into smaller methods.

```scala
inline def someMacro2[T](inline n: Int, elem: T): Seq[T] =
  ${ someMacroImpl2[T]('{ n }, '{ elem }) }

def someMacroImpl2[T: Type](n: Expr[Int], elem: Expr[T])(using quotes: Quotes): Expr[Seq[T]] = {
  import quotes.reflect.*
  import scala.collection.mutable

  val longList = Seq.fill(n.valueOrAbort)(elem)

  val symbol = Symbol.newVal(
    Symbol.spliceOwner,
    Symbol.freshName("builder"),
    TypeRepr.of[mutable.Builder[T, Seq[T]]],
    Flags.Synthetic,
    Symbol.noSymbol,
  )

  val valDef = ValDef(symbol, Some('{ Seq.newBuilder[T] }.asTerm))

  val builder = Ref(symbol).asExprOf[mutable.Builder[T, Seq[T]]]

  val additions = longList
    .map(element =>
      '{
        def avoidTooLargerMethod(): Unit = $builder += $element
          avoidTooLargerMethod()
      }.asTerm,
    )
    .toList

  val result = '{ $builder.result() }.asTerm

  Block(valDef :: additions, result).asExprOf[Seq[T]]
}
```

The entry point is much the same, but in the implementation, we use `quotes.reflect.*` to build the AST manually.
We create a new Symbol for a mutable builder, then we create a `ValDef` to define this builder variable.
Fresh name generation is crucial here to avoid name clashes in the generated code.
We create a reference to this builder with `Ref(symbol)`.
`additions` is a list of terms, each representing a local method that adds an element to the builder. We don't have to
worry about the method names since they are local and will be compiled to unique private methods.
We then create a `Block` that contains the variable definition, all the addition methods, and the final result
retrieval. Finally, we convert this block to an expression of type `Seq[T]`.

The generated code looks like this:

```scala
def usage = {
  val builder$macro$1: scala.collection.mutable.Builder[scala.Int, scala.collection.immutable.Seq[scala.Int]] = scala.Seq.newBuilder[scala.Int]

  def avoidTooLargerMethod(): scala.Unit = {
    builder$macro$1.+=(42)
    ()
  }

  avoidTooLargerMethod()

  def `avoidTooLargerMethod₂`(): scala.Unit = {
    builder$macro$1.+=(42)
    ()
  }

  `avoidTooLargerMethod₂`()

  def `avoidTooLargerMethod₃`(): scala.Unit = {
    builder$macro$1.+=(42)
    ()
  }

  `avoidTooLargerMethod₃`()
  builder$macro$1.result()
}
```

and decompiled to Java:

```java
//
// Source code recreated by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

//decompiled from Usage$package.class

import scala.collection.immutable.Seq;

public final class Usage$package {
    public static Seq<Object> usage() {
        return Usage$package$.MODULE$.usage();
    }
}

//decompiled from Usage$package$.class
import java.io.Serializable;
import scala.collection.immutable.Seq;
import scala.collection.mutable.Builder;
import scala.package.;
import scala.runtime.BoxesRunTime;
import scala.runtime.ModuleSerializationProxy;

public final class Usage$package$ implements Serializable {
    public static final Usage$package$ MODULE$ = new Usage$package$();

    private Usage$package$() {
    }

    private Object writeReplace() {
        return new ModuleSerializationProxy(Usage$package$.class);
    }

    public Seq<Object> usage() {
        Builder var1 = .MODULE$.Seq().newBuilder();
        this.avoidTooLargerMethod$1(var1);
        this.avoidTooLargerMethod$2(var1);
        this.avoidTooLargerMethod$3(var1);
        return (Seq) var1.result();
    }

    private final void avoidTooLargerMethod$1(final Builder builder$macro$1$1) {
        builder$macro$1$1.$plus$eq(BoxesRunTime.boxToInteger(42));
    }

    private final void avoidTooLargerMethod$2(final Builder builder$macro$1$2) {
        builder$macro$1$2.$plus$eq(BoxesRunTime.boxToInteger(42));
    }

    private final void avoidTooLargerMethod$3(final Builder builder$macro$1$3) {
        builder$macro$1$3.$plus$eq(BoxesRunTime.boxToInteger(42));
    }
}

```

## Case Closed

Back to working on my thesis now. We'll see if I find time to write something here again.
Written by me, with AI reviewing my English.