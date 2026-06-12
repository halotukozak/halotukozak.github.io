---
title: 'Magical Kotlin: Building a Type-Safe Validation DSL'
description: 'A walking tour of context parameters, KProperty0, definitely-non-null types, contracts, sealed scopes, explicit backing fields, fun interface, inline+reified, expect/actual, @JvmName and KSP — by building a multiplatform validation DSL from scratch.'
published: 2026-06-10
draft: false
tags: [ 'kotlin', 'dsl', 'validation', 'context-parameters', 'metaprogramming', 'contracts', 'backing-fields', 'ksp', 'type-class' ]
toc: true
---

## Kotlin Is Getting Tricky

Scala has the reputation for complexity on the JVM.
Kotlin is usually seen as the pragmatic, safe, slightly boring alternative.
I think that is changing.
With a handful of recent features — context parameters, definitely-non-null types, contracts — Kotlin can be just as
clever, and just as fun to abuse.

To show how these compose, I built a small validation library called [`sure`](https://github.com/halotukozak/sure).
It is Kotlin Multiplatform, and the public API reads like this:

```kotlin
@Validatable
data class LoginRequest(val username: String, val password: String) {
    companion object {
        val validator = Validator<LoginRequest> {
            field(::username) { notBlank(); lengthIn(1..254) }
            field(::password) { notBlank(); lengthIn(8..1024) }
        }
    }
}

LoginRequest("alice", "hunter22!").validate() // ValidationResult.Valid
```

No reflection on user types, no string field names — and that `validate()` isn't hand-written.
A KSP processor generates it at compile time (Step 14); everything between here and there is how the pieces it relies on
get built.

### A Note on Valiktor

What I built looks a lot like [Valiktor](https://github.com/valiktor/valiktor).
I found it after I'd written most of this.
Valiktor predates context parameters and definitely-non-null types, so its API carries more boilerplate.
This post is not "Valiktor but better."
It is the path I'd walk building the same thing today.

## Setup

Everything below uses Kotlin **2.4.0**.
Context parameters are stable there — no compiler flag, no opt-in.
If you're on an older version you'll need `-Xcontext-parameters`, and on much older ones you might know them as
`context receivers` — different syntax, same mental model.

I'll build the library one feature at a time, and every step is provoked by a concrete pain in the step before it —
nothing appears until something forces it to.
To keep each snippet self-contained, the early steps carry error messages as plain `String`s; [
`sure`](https://github.com/halotukozak/sure) itself uses a structured `Message` type and splits a couple of declarations
across platforms, both of which I fold in near the end.
The data class under validation is the same throughout:

```kotlin
data class User(val name: String, val age: Int)
```

## Step 1: The hand-rolled version

The simplest thing that could work — one function:

```kotlin
fun validateUser(user: User): List<String> {
    val errors = mutableListOf<String>()

    when {
        user.name.isBlank() -> errors += "name: must not be blank"
        user.name.length !in 1..50 -> errors += "name: must be 1..50 characters"
    }
    if (user.age !in 0..150) errors += "age: must be in 0..150"

    return errors
}
```

It works, but it hurts.
The error list is hand-threaded through every branch.
Field names are strings.
Each rule re-states the field it talks about.
And nested objects don't compose — a `User` with an `Address` means another function, another list, another round of
string-prefixing.

Everything below is the slow dismantling of this function.
Each fix removes one pain and, in doing so, drags in exactly one Kotlin feature.

## Step 2: A scope to hold the errors

The first pain is the most basic: the error list is a local variable I pass around by hand.
I'll move it into an object that travels with the validation — a *scope*.
The scope holds the value being checked and owns the error list, so rules just call `raise`:

```kotlin
class ValidationScope<T>(val value: T) {
    val errors: List<String>
        field = mutableListOf()
    fun raise(message: String) {
        errors += message
    }
}
```

That `field = mutableListOf()` under the property is not a typo — it's an **explicit backing field**, stable as of
Kotlin 2.4 (experimental behind `-Xexplicit-backing-fields` in 2.3). It lets a `val` declare two types: a public one and
the one the field actually holds.
Here the public type is `List<String>`, but inside the class the name `errors` resolves to the `MutableList` behind it —
so callers get a read-only view while `raise` still appends, with no `_errors`-plus-getter dance.

To run rules against a scope, I take a lambda with the scope as its receiver — that lambda *is* the validator:

```kotlin
class Validator<T>(private val rules: ValidationScope<T>.() -> Unit) {
    fun validate(value: T): List<String> {
        val scope = ValidationScope(value)
        scope.rules()
        return scope.errors
    }
}
```

The call site already reads better — no list to declare, no list to return:

```kotlin
val userValidator = Validator<User> {
    if (value.name.isBlank()) raise("name: must not be blank")
    if (value.age !in 0..150) raise("age: must be in 0..150")
}

userValidator.validate(User("", 200)) // [name: must not be blank, age: must be in 0..150]
```

`rules: ValidationScope<T>.() -> Unit` is a *function with receiver*: inside the braces, `this` is the scope, so `value`
and `raise` resolve unqualified.
Still, the messages are strings and I'm reaching into `value.name` while re-typing `"name:"` by hand.
That duplication is the next pain.

## Step 3: KProperty0 — name the field once

`"name"` (the label) and `value.name` (the read) are the same field spelled twice.
I want to name it once.
Kotlin has bound property references for exactly this: `user::name` is a `KProperty0<String>` that carries both the
property's `name` and a zero-argument `get()`.

To use them, the rules block hands its value back to me, and the scope grows a parent link and a path so a field can
descend into a child scope that still reports into the same error list:

```kotlin
class Validator<T>(private val rules: ValidationScope<T>.(T) -> Unit) {
    fun validate(value: T): List<String> {
        val scope = ValidationScope(value)
        scope.rules(value)
        return scope.errors
    }
}

class ValidationScope<T>(
    val value: T,
    private val parent: ValidationScope<*>? = null,
    val path: String = "",
) {
    val errors: MutableList<String> = parent?.errors ?: mutableListOf()
    fun raise(message: String) {
        errors += if (path.isEmpty()) message else "$path: $message"
    }
}
```

`field` takes the property reference, reads it once, and runs the block against a child scope:

```kotlin
fun <F> ValidationScope<*>.field(property: KProperty0<F>, block: ValidationScope<F>.(F) -> Unit) {
    val childPath = if (path.isEmpty()) property.name else "$path.${property.name}"
    val child = ValidationScope(property.get(), this, childPath)
    child.block(property.get())
}
```

The leaf checks are extensions on the scope they apply to, so `notBlank()` exists only on a `ValidationScope<String>`:

```kotlin
fun ValidationScope<String>.notBlank() {
    if (value.isBlank()) raise("must not be blank")
}

fun <T : Comparable<T>> ValidationScope<T>.inRange(range: ClosedRange<T>) {
    if (value !in range) raise("must be in $range")
}
```

The field name is written once now, as a bound reference:

```kotlin
val userValidator = Validator<User> { user ->
    field(user::name) { notBlank() }
    field(user::age) { inRange(0..150) }
}
```

Better — but two things still grate.
The block has to name its value (`user ->`) and every reference repeats it (`user::name`, `user::age`).
And each check is welded to one receiver: `field`, `notBlank`, `inRange` are all extensions on `ValidationScope`, so a
function can require exactly one scope and nothing more.

## Step 4: Context parameters — drop the receiver juggling

I'd rather write `field(::name)` than `field(user::name)`, and lose the `user ->`.
For `::name` to resolve, `this` inside the block has to be the `User` — but the block still has to reach the scope, to
`raise`.
That's two receivers at once, and an ordinary `T.() -> Unit` only gives you one.

Carrying an implicit dependency like this is one of the things **context parameters** are good for — not the only one,
but the one that fits here.
A context parameter is a dependency a function declares without making it *the* receiver.
The rules block becomes "an extension on the value, with a scope available in context":

```kotlin
class Validator<T>(private val rules: context(ValidationScope<T>) T.() -> Unit) {
    fun validate(value: T): List<String> {
        val scope = ValidationScope(value)
        rules(scope, value)
        return scope.errors
    }
}
```

Now `this` is the `User`, so `::name` resolves, while the `ValidationScope<User>` rides along in context — no `user ->`.
`field` declares the scope it needs as a context parameter instead of an extension receiver:

```kotlin
context(scope: ValidationScope<*>)
fun <F> field(property: KProperty0<F>, block: ValidationScope<F>.(F) -> Unit) {
    val childPath = if (scope.path.isEmpty()) property.name else "${scope.path}.${property.name}"
    val child = ValidationScope(property.get(), scope, childPath)
    child.block(property.get())
}
```

The checks move from receiver to context too, sharing one `check` helper. Note the predicate flags the *failure*: when
it returns `true`, the value is bad and `check` raises — so each leaf describes what's wrong, not what's allowed.

```kotlin
context(scope: ValidationScope<T>)
fun <T> check(predicate: (T) -> Boolean, onError: (T) -> String) {
    if (predicate(scope.value)) scope.raise(onError(scope.value))   // predicate true → raise
}

context(_: ValidationScope<String>)
fun notBlank() = check<String>({ it.isBlank() }) { "must not be blank" }

context(_: ValidationScope<T>)
fun <T : Comparable<T>> inRange(range: ClosedRange<T>) = check({ it !in range }) { "must be in $range" }
```

The call site loses both the `user ->` and the repeated receiver:

```kotlin
val userValidator = Validator<User> {
    field(::name) { notBlank() }
    field(::age) { inRange(0..150) }
}
```

The one trap worth calling out: a context parameter is *not* a second `this`. If you remember the old *context
receivers*, those did add a second receiver — context **parameters** don't. Inside `Validator<User> { … }` there's a
single `this` (the `User`), so `::name` resolves against it, while the scope just rides along:

| Inside…                 | the single `this` is…         | the scope is…                                                          |
|-------------------------|-------------------------------|------------------------------------------------------------------------|
| `Validator<User> { … }` | the `User`                    | an ambient `context(ValidationScope<User>)` parameter — *not* a `this` |
| `field(::name) { … }`   | the `ValidationScope<String>` | the receiver itself (`field`'s block is `ValidationScope<F>.(F)`)      |

You can't call the scope's members directly — `raise("…")` won't resolve in the outer block, and there's no
`this@ValidationScope` label. Its only job is to *satisfy other functions that ask for one*: when `notBlank()` declares
`context(_: ValidationScope<String>)`, the compiler finds the nearest matching value and wires it in. It's resolution,
not dispatch, and at the JVM level it lowers to an ordinary leading argument. A function can also ask for several
context parameters at once — which is what lets a `field` block stay a plain extension on the scope while the value
arrives as the lambda argument.

## Step 5: Nesting — the sealed scope family and the `value` contract

`field` descends one level.
The real test is depth, where errors must report a sensible path — `address.zip`, `tags[2]`, `headers[Accept]` — and
each kind of descent builds that path differently.
A single `ValidationScope` class can't express "append `.name`" vs "append `[index]`" vs "append `[key]`" cleanly, so I
split it into a small two-tier family.
The base declares the contract; one intermediate owns the error list, the other forwards errors to its parent; and a
leaf per nesting kind only has to say how it builds its `path`.

The base also gains a `shortCircuit` flag here; ignore it
until [Step 9](#step-9-fail-fast--short-circuiting-across-platforms), where it earns its keep.

```kotlin
@ValidationDsl
sealed class ValidationScope<out T> {
    internal abstract val path: String

    @PublishedApi
    internal abstract val shortCircuit: Boolean
    internal abstract fun addError(error: ValidationError)

    fun raise(message: String) = addError(ValidationError(path, message))
}

// owns the error list — RootScope, and the throwaway EphemeralScope from Step 8
sealed class ParentScope<out T> : ValidationScope<T>() {
    val errors: List<ValidationError>
        field = mutableListOf()
    final override fun addError(error: ValidationError) {
        errors += error
    }
}

// no list of its own — forwards every error up to its parent
sealed class ChildrenScope<out T> : ValidationScope<T>() {
    abstract val parent: ValidationScope<*>
    final override fun addError(error: ValidationError) = parent.addError(error)
}

internal class RootScope<out T>(val value: T, override val shortCircuit: Boolean) : ParentScope<T>() {
    override val path = ""
}

internal class FieldScope<out T>(
    val value: T, name: String,
    override val parent: ValidationScope<*>,
    override val shortCircuit: Boolean = parent.shortCircuit,
) : ChildrenScope<T>() {
    override val path = if (parent.path.isEmpty()) name else "${parent.path}.$name"
}

internal class ItemScope<out T>(
    val value: T, index: Int,
    override val parent: ValidationScope<*>,
    override val shortCircuit: Boolean = parent.shortCircuit,
) : ChildrenScope<T>() {
    override val path = "${parent.path}[$index]"
}

internal class EntryScope<out T>(
    val value: T, key: Any?,
    override val parent: ValidationScope<*>,
    override val shortCircuit: Boolean = parent.shortCircuit,
) : ChildrenScope<T>() {
    override val path = "${parent.path}[$key]"
}
```

Two intermediate classes carry all the plumbing.
`ParentScope` owns the list — behind the explicit backing field from Step 2, so `addError` appends internally while
callers only read — and `ChildrenScope` forwards `addError` to its `parent`, so every nested error bubbles up to the one
`RootScope` at the top.
A leaf then declares only its `path` and holds its `value`; `raise` lives once, on the base.
Both intermediates and the base are `sealed`, which matters for the accessor next.

Errors are now a small type instead of a bare string, so the path rides along (this becomes a sealed type with `Field`/
`Element`/`Root` cases in [Step 13](#step-13-structured-translatable-messages--fun-interface)):

```kotlin
data class ValidationError(val path: String, val message: String)
```

### The `value` contract

Start with the payoff, because the syntax below only makes sense once you know what it buys.
Picture a user validating a nullable field — `optional(::nickname) { … }` where `nickname: String?`. Inside that block
I want to call `notBlank()`, but `notBlank()` only exists on `ValidationScope<String>`, not `ValidationScope<String?>`.
Without help I'd be writing `value!!` or `value?.let { … }` at every single check — exactly the null-noise this library
exists to delete. What I want instead: one null check at the top of the block, and the compiler treats the value as a
plain `String` for the rest — no `!!`, no `?`, no cast.

A **contract** delivers that. It's a promise the getter makes to the compiler, stated in the `contract { }` block:
*when this getter returns a non-null value, treat the receiver as a scope of the non-null type* — written
`returnsNotNull() implies (this@value is ValidationScope<T & Any>)`. That `T & Any` is a **definitely-non-null type**:
"the non-null version of an unbounded generic `T`" — for nullable `T = X?` it's `X`, for already-non-null `T` it
collapses to `T`.

A contract can refine the type of the *receiver*, and the receiver here is the scope — which is the one reason this is
an *extension property*, not a base member. The body is a plain exhaustive `when`, no `else`, because the base is
`sealed`:

[//]: # (@formatter:off)
```kotlin
@OptIn(ExperimentalContracts::class)
val <T> ValidationScope<T>.value: T
    get() {
        contract {
            returnsNotNull() implies (this@value is ValidationScope<T & Any>)
        }

        return when (this) {
            is RootScope -> value
            is FieldScope -> value
            is ItemScope -> value
            is EntryScope -> value
            is EphemeralScope -> value
        }
    }
```
[//]: # (@formatter:on)

In Step 7 this same contract lets one helper handle nullable and non-nullable fields with no cast.

The collection combinators each spin up the matching scope, so a deep failure still reports the right path:

```kotlin
context(scope: ValidationScope<List<T>>)
inline fun <T : Any> eachItem(rule: ValidationScope<T>.(T) -> Unit) {
    scope.value.forEachIndexed { index, item ->
        ItemScope(item, index, scope).rule(item)
    }
}

context(scope: ValidationScope<Map<K, V>>)
inline fun <K, V : Any> eachValue(rule: ValidationScope<V>.(V) -> Unit) {
    for ((k, v) in scope.value) EntryScope(v, k, scope).rule(v)
}
```

A failure inside `eachItem` now reports `tags[2]: must not be blank`, because `ItemScope` built that path from its
parent's.

## Step 6: @DslMarker — closing the leak

Now that scopes nest, the DSL has a quiet bug.
Inside a nested block, `this` is the inner scope — but the enclosing scope is still in lexical reach, and both expose
`raise`, `addError`, and friends.
A member meant for the outer scope can silently resolve there from an inner block, attaching an error at the wrong path,
with no error from the compiler.

`@DslMarker` is the fence against this.
Annotate the scope type and the compiler forbids an *implicit* call that would skip past the nearest receiver to an
outer one of the same marker:

```kotlin
@DslMarker
annotation class ValidationDsl
```

That's the annotation already sitting on `ValidationScope` back in Step 5.
After it, reaching an outer scope from a nested block is a compile error unless you qualify it explicitly (
`this@Validator.raise(...)`).
You only ever see the innermost scope by default — which is what you wanted.

## Step 7: Nullable fields — `field` vs `optional`

So far `field` assumed a non-null property.
Real DTOs have nullable fields, with two sensible behaviors: *skip if null* (`optional`), or *fail if null* (a required
field that happens to be nullable).
The definitely-non-null type from Step 5 carries the whole signature, and `runScope` (Step 9) wraps each descent:

```kotlin
context(scope: ValidationScope<*>)
inline fun <F : Any> field(
    property: KProperty0<F>,
    shortCircuit: Boolean = scope.shortCircuit,
    block: ValidationScope<F>.(F) -> Unit = {},
) {
    val value = property.get()
    runScope { FieldScope(value, property.name, scope, shortCircuit).block(value) }
}

context(scope: ValidationScope<*>)
inline fun <F : Any> optional(
    property: KProperty0<F?>,
    shortCircuit: Boolean = scope.shortCircuit,
    block: ValidationScope<F>.(F) -> Unit,
) {
    val value = property.get()
    if (value != null) {
        runScope { FieldScope(value, property.name, scope, shortCircuit).block(value) }
    }
}
```

`optional` takes a `KProperty0<F?>` and, inside the null check, the value narrows to `F`.
`field` constrains its block to `F : Any`, so even on a nullable property the rules see a non-null value.
No casts anywhere — `F & Any` does the narrowing in the type, the Step 5 contract does it on the value.

## Step 8: Combinators that need a private scope — anyOf / not

Some combinators don't want their inner errors recorded — they only care *whether* the inner rules passed.
`anyOf` succeeds if any branch is clean; `not` succeeds if its rule fails.
Both run rules against a throwaway scope whose errors never reach the parent.
This is the fifth scope, and it falls straight out of the Step 5 split: it *owns* its errors rather than forwarding
them, so it's a `ParentScope`, and that's the entire definition — the list, the backing field, and `addError` are all
inherited.

```kotlin
internal class EphemeralScope<out T>(
    val value: T,
    parent: ValidationScope<*>,
    override val shortCircuit: Boolean = parent.shortCircuit,
) : ParentScope<T>() {
    override val path = parent.path
}

context(scope: ValidationScope<T>)
fun <T> anyOf(vararg rules: ValidationScope<T>.() -> Unit, message: () -> String) {
    val anyValid = rules.any { rule ->
        val isolated = EphemeralScope(scope.value, scope)
        runScope { isolated.rule() }
        isolated.errors.isEmpty()
    }
    if (!anyValid) scope.raise(message())
}

context(scope: ValidationScope<T>)
fun <T> not(rule: ValidationScope<T>.() -> Unit, message: () -> String) {
    val isolated = EphemeralScope(scope.value, scope)
    runScope { isolated.rule() }
    if (isolated.errors.isEmpty()) scope.raise(message())   // rule passed → negation fails
}
```

`EphemeralScope` keeps its own list instead of delegating up, so the parent never sees the trial-run errors.

## Step 9: Fail-fast — short-circuiting across platforms

Until now every rule runs and all errors accumulate.
Sometimes you want the opposite: stop at the first failure.
Fail-fast has to unwind out of arbitrarily nested blocks back to the nearest boundary, and the cleanest unwinding
mechanism is an exception — one that's cheap and never looks like a real error.
Kotlin's `CancellationException` is exactly that. It lives in the coroutines world, but it's an ordinary
`RuntimeException` with no coroutine machinery attached — nothing here suspends. Borrowing it just means any stray
`catch (e: Exception)` that wraps a validator is conventionally expected to rethrow it rather than swallow it, so the
control-flow throw is less likely to be eaten by accident.

The public `raise(message)` from Step 5 now routes through a protected `raise(error)` that throws when `shortCircuit` is
on — which is why the base carried that flag since Step 5:

```kotlin
// on ValidationScope
fun raise(message: String) = raise(ValidationError(path, message))

protected fun raise(error: ValidationError) {
    addError(error)
    if (shortCircuit) throw ScopeShortCircuit()
}
```

`runScope` is the boundary that swallows the throw — so siblings keep running when accumulating, and unwinding stops
here when failing fast:

```kotlin
@PublishedApi
internal inline fun runScope(block: () -> Unit) = try {
    block()
} catch (_: ScopeShortCircuit) {
    // expected: short-circuit unwinds to here
}
```

Because `sure` is Multiplatform, `ScopeShortCircuit` is declared `expect` and each target supplies an `actual`.
The JVM one skips the most expensive part of throwing — filling in the stack trace — since this exception is pure
control flow:

```kotlin
// commonMain
@PublishedApi
internal expect class ScopeShortCircuit() : CancellationException

// jvmMain
internal actual class ScopeShortCircuit actual constructor() :
    CancellationException("validation short-circuit") {
    override fun fillInStackTrace(): Throwable = this   // never logged or inspected
}

// iosMain
internal actual class ScopeShortCircuit actual constructor() :
    CancellationException("validation short-circuit")
```

The strategy is toggled per validator with `failFast()` / `accumulating()`, which rebuild it with a different flag.

## Step 10: The Validator class — inline, reified, noinline

`Validator` has been a thin wrapper.
I want three things from it: construct it as `Validator<User> { … }`, look it up later by type, and validate an
arbitrary value.
Looking up by type means storing `T::class`, which means the type must survive to runtime — `reified` — and that forces
the constructing function `inline`:

```kotlin
open class Validator<T>(
    protected val kClass: KClass<T & Any>,
    internal val shortCircuit: Boolean,
    internal val applyRules: ValidationScope<T>.() -> Unit,
) {
    companion object {
        inline operator fun <reified T : Any> invoke(
            shortCircuit: Boolean = true,
            noinline rules: context(ValidationScope<T>) T.() -> Unit,
        ): Validator<T> = Validator(T::class, shortCircuit) { rules(value) }
    }
}
```

Three deliberate keywords:

- **`reified T`** keeps the type at runtime, so `T::class` is a real `KClass` for the registry — and that's what forces
  `inline`.
- **`noinline rules`** is the counterweight: the lambda is *stored* in the `Validator`, so it must exist as a real
  object in bytecode, and inlined lambdas don't — their bodies are copied into the call site with nothing left to store.
- The rules type `context(ValidationScope<T>) T.() -> Unit` is the same context-plus-receiver shape from Step 4, now at
  the top level — `this` is the value, the scope is in context.

## Step 11: Validating an `Any` — the isInstanceOf contract

The point of the registry is to validate a value you only know as `Any?`.
After a runtime type check I want to use it as `T` without an unchecked cast — and a contract buys that:

```kotlin
@OptIn(ExperimentalContracts::class)
private fun <T : Any> Any.isInstanceOf(kClass: KClass<T>): Boolean {
    contract { returns(true) implies (this@isInstanceOf is T) }
    return kClass.isInstance(this)
}

open fun validate(value: Any?): ValidationResult = when {
    value == null -> ValidationResult.Invalid(ValidationError.Root(Message.NotNull))
    !value.isInstanceOf(kClass) ->
        ValidationResult.Invalid(ValidationError.Root(Message.TypeMismatched(kClass, value::class)))
    else -> {
        val scope = RootScope(value, shortCircuit)   // value smart-cast to T here
        runScope { applyRules(scope) }
        if (scope.errors.isEmpty()) ValidationResult.Valid else ValidationResult.Invalid(scope.errors)
    }
}
```

`returns(true) implies (this is T)` reads alarming — it's an *unverified* assertion, meaning the compiler can't prove it
and takes the claim on faith, then smart-casts `value` to `T` with no `as T` and no warning. What makes it safe rather
than reckless is the function body: `KClass.isInstance` performs the real runtime type check, so by the time the
assertion is "trusted" it has already been verified at runtime. The contract just teaches the compiler what that
`Boolean` result *means*.
`ValidationResult` is just `Valid` or `Invalid(errors)` — a sealed result type that replaces the raw `List` once there's
a type mismatch to report.

## Step 12: @JvmName — overloads the JVM can't tell apart

I want `positive()` for `Int`, `Long`, and `Double`.
In Kotlin these are three distinct context functions:

```kotlin
context(_: ValidationScope<Int>)
fun positive() = check({ it <= 0 }) { Message.Positive }

context(_: ValidationScope<Long>)
fun positive() = check({ it <= 0L }) { Message.Positive }

context(_: ValidationScope<Double>)
fun positive() = check({ it <= 0.0 }) { Message.Positive }
```

But the context parameter erases to a plain argument, so all three collapse to the same JVM signature —
`positive(ValidationScope)` — and the bytecode won't link.
The fix is a distinct JVM name behind one Kotlin name:

```kotlin
@JvmName("positiveInt")
context(_: ValidationScope<Int>)
fun positive() = check({ it <= 0 }) { Message.Positive }

@JvmName("positiveLong")
context(_: ValidationScope<Long>)
fun positive() = check({ it <= 0L }) { Message.Positive }
```

Kotlin callers still write `positive()`; the compiler picks by context type and emits the right `@JvmName`.

## Step 13: Structured, translatable messages — fun interface

The messages have been bare strings this whole time.
Errors shouldn't hard-code English, so I replace the string with a `Message` carrying a stable `key`, pre-stringified
`args`, and a default `text`:

```kotlin
data class Message(val key: String, val args: List<String> = emptyList(), val text: String = key) {
    fun render(translator: Translator? = null): String = translator?.translate(key, args) ?: text

    companion object {
        val NotBlank = Message("validation.notBlank", text = "must not be blank")
        fun LengthIn(range: IntRange) =
            Message("validation.lengthIn", listOf(range.toString()), "must be $range characters")
        // …
    }
}
```

The translator is a single-method interface, so I declare it `fun interface` and any caller can hand it a lambda:

```kotlin
fun interface Translator {
    fun translate(key: String, args: List<String>): String?
}

val pl = Translator { key, args -> catalogue[key]?.format(args) }
error.message.render(pl)   // a lambda where an interface is expected
```

`render` falls back to `text` when no translator resolves the key — useful out of the box, localizable when you need it.
The `ValidationError` from Step 5 grows into a sealed type whose cases carry a `Message` and a path:

```kotlin
sealed interface ValidationError {
    val message: Message

    data class Field(val path: String, override val message: Message) : ValidationError
    data class Element(val path: String, val index: Int, override val message: Message) : ValidationError
    data class Root(override val message: Message) : ValidationError
}
```

This is the one place the Step 5 split shows a seam.
With a single `ValidationError(path, message)`, `raise` could live once on the base.
Now the *case* depends on the scope — `Root` for root and ephemeral scopes, `Field` for a field or map entry,
`Element` (with its index) for a list item — so `raise(message: Message)` goes back to `abstract` on the base, and each
leaf builds its own:

```kotlin
abstract fun raise(message: Message)   // on ValidationScope, replacing the String version

// RootScope, EphemeralScope
override fun raise(message: Message) = raise(ValidationError.Root(message))

// FieldScope, EntryScope
override fun raise(message: Message) = raise(ValidationError.Field(path, message))

// ItemScope
override fun raise(message: Message) = raise(ValidationError.Element(parent.path, index, message))
```

Every `check` now returns a `Message` instead of a `String`; the rest of the structure is untouched.

## Step 14: @Validatable + KSP — generating `validate()`

One pain is left: calling `someValidator.validate(req)` by hand and wiring up a registry.
The shape I'm after is the one from the very top of this post — tag a class `@Validatable`, point it at its validator,
and get a `validate()` extension for free:

```kotlin
@Validatable
data class LoginRequest(val username: String, val password: String) {
    companion object {
        val validator = Validator<LoginRequest> {
            field(::username) { notBlank(); lengthIn(1..254) }
            field(::password) { notBlank(); lengthIn(8..1024) }
        }
    }
}

LoginRequest("alice", "hunter22!").validate()   // ValidationResult — nothing hand-wired
```

The annotation itself is tiny.
It marks the class and, optionally, names an external validator object instead of the companion `validator`:

```kotlin
@Target(AnnotationTarget.CLASS)
annotation class Validatable(val with: KClass<out Validator<*>> = Validator::class)
```

Turning that `@Validatable` into a real `validate()` is a compile-time job,
and [KSP](https://kotlinlang.org/docs/ksp-overview.html) — Kotlin Symbol Processing — is the tool for it.
It's the lightweight successor to `kapt`: instead of generating Java stubs and running a `javac` annotation processor,
KSP hands you a resolved view of the program's *Kotlin* symbols (classes, functions, properties, annotations) and lets
you emit new source files, which the compiler then picks up in the same build.
No reflection, no runtime cost, no stub round-trip — the generated `validate()` is as if you'd typed it.

The entry point is a `SymbolProcessorProvider` that builds a `SymbolProcessor`; the processor's `process` is the
workhorse.
KSP runs in *rounds* — `process` can be called again as new symbols appear — so a one-shot generator guards itself with
a flag and returns deferred symbols (here, none):

```kotlin
class ValidationExtensionProcessorProvider : SymbolProcessorProvider {
    override fun create(env: SymbolProcessorEnvironment): SymbolProcessor =
        ValidationExtensionProcessor(env.codeGenerator, env.logger)
}

// registered via META-INF/services so the KSP plugin discovers it
```

```kotlin
private var generated = false

override fun process(resolver: Resolver): List<KSAnnotated> {
    if (generated) return emptyList()

    val classes = resolver.getSymbolsWithAnnotation(ANNOTATION_FQN, false)
        .filterIsInstance<KSClassDeclaration>().toList()
    val refs = classes.mapNotNull { it.toValidatorRef() }
    if (refs.isEmpty()) return emptyList()

    codeGenerator.createNewFile(Dependencies(false, *originatingFiles), GENERATED_PACKAGE, GENERATED_FILE)
        .use { OutputStreamWriter(it).use { w -> w.write(render(refs)) } }
    generated = true
    return emptyList()
}
```

`Dependencies(false, *originatingFiles)` is the incremental-build wiring: it tells KSP which source files the generated
file derives from, so editing one `@Validatable` class regenerates only what's affected instead of the whole module.

`toValidatorRef` is where the annotation is read.
A `@Validatable` type names its validator one of two ways, and the processor resolves each by walking the KSP symbol
tree rather than by reflection:

```kotlin
private fun KSClassDeclaration.toValidatorRef(): ValidatorRef? {
    val receiverFqn = qualifiedName?.asString() ?: return null
    // either @Validatable(with = SomeValidator::class), read off the annotation argument…
    val validatorExpr = customValidatorFqn()
    // …or a `validator` property on the companion object
        ?: companionValidatorExpression(receiverFqn)
        ?: return null   // neither → logger.error(), build fails
    return ValidatorRef(receiverFqn, validatorExpr)
}
```

Reading `with =` means resolving the annotation argument as a `KSType` and taking its qualified name; the companion path
scans the class's declarations for a property called `validator`.
If neither is present, the processor calls `logger.error(...)` with the offending class, which fails the build with a
pointed message instead of emitting code that won't compile.

There's no clever code generator behind `render` — it's a plain `buildString` that concatenates Kotlin source as text
from the `(class, validator)` pairs it collected.
No templating engine, no AST builder; it just prints the strings.
For each `@Validatable` type it emits a `validate()` extension, plus a shared `validatorsByClass` map and a
`reified validatorFor<T>()` lookup:

```kotlin
fun com.example.LoginRequest.validate(): ValidationResult =
    com.example.LoginRequest.validator.validate(this)

@PublishedApi
internal val validatorsByClass: Map<KClass<*>, Validator<*>> = mapOf(
    com.example.LoginRequest::class to com.example.LoginRequest.validator,
)

@Suppress("UNCHECKED_CAST")
inline fun <reified T : Any> validatorFor(): Validator<T> =
    validatorsByClass[T::class] as? Validator<T>
        ?: error("No validator registered for ${T::class.qualifiedName}")
```

This is the Kotlin equivalent of Scala's automatic type-class derivation — except instead of inductive `given`s resolved
by the compiler, it's a code generator emitting plain source.

That closes the loop: the public API from the very top of this post is now fully assembled.

## Through the Decompiler

The library is done — the section below is a bonus for the curious. Most of the "magic" above exists only in source;
decompiling the JVM target shows it flattening into ordinary bytecode patterns. If you don't care what it lowers to,
jump to [Case Closed](#case-closed).

**Context parameters** are the clearest case.
A check like `notBlank()` has no receiver in Kotlin, but its `context(_: ValidationScope<String>)` lowers to a plain
leading parameter:

[//]: # (@formatter:off)
```java
public static final void notBlank(ValidationScope $context) {
    check($context, NotBlankPredicate.INSTANCE, NotBlankMessage.INSTANCE);
}
```
[//]: # (@formatter:on)

**`field(::name)`** inlines into the caller.
The property reference becomes a fresh synthetic class with a `get()`; there is no reflective dispatch, just a
specialized getter call:

[//]: # (@formatter:off)
```java
KProperty0 property$iv = (KProperty0) new PropertyReference0Impl($receiver) {
    public Object get() {
        return ((User) this.receiver).getName();
    }
};
Object value$iv = property$iv.get();
FieldScope fs = new FieldScope(value$iv, property$iv.getName(), scope$iv, shortCircuit$iv);
// … inlined block body …
```
[//]: # (@formatter:on)

**`reified T`** in `Validator<User> { … }` lowers to a literal `User.class` at the call site —
`Reflection.getOrCreateKotlinClass(User.class)` — captured into the `Validator` constructor.
The `noinline rules` lambda forced a real `Function` object, so it shows up as a synthetic class rather than copied-in
code; that's the whole point of `noinline`.

**The short-circuit** is just exception control flow.
`runScope` is a `try/catch (ScopeShortCircuit)`, and on the JVM the override `fillInStackTrace() { return this; }` means
throwing it costs nothing beyond the allocation — no stack walk.

**Contracts** leave *no trace at all* in bytecode.
`returns(true) implies (this is T)` and `returnsNotNull() implies …` are compile-time-only — they change what the Kotlin
compiler will let you write, then evaporate.
The decompiled `isInstanceOf` is a one-liner returning `kClass.isInstance(this)`; the smart cast it enabled became an
ordinary, checked-at-source assignment with no runtime cast inserted.

**Explicit backing fields** collapse to exactly what you'd hand-write.
The `val errors: List` / `field = mutableListOf()` pair becomes one private field and a read-only getter — no second
property, and crucially no setter:

[//]: # (@formatter:off)
```java
private final List errors = new ArrayList();        // the single backing field
public final List getErrors() { return this.errors; }  // read-only — no setErrors emitted
```
[//]: # (@formatter:on)

Inside the class, where `errors` means the `MutableList`, `errors += message` is just a method call on that same field:

[//]: # (@formatter:off)
```java
((Collection) this.errors).add(message);   // from `errors += message`
```
[//]: # (@formatter:on)

So the encapsulation is real, not a wrapper: callers see `List`, the class mutates the one underlying instance, and
nothing is allocated to bridge the two.

**`@JvmName`** is the most literal lowering of all — the three `positive()` overloads simply become three
differently-named static methods, exactly as annotated:

[//]: # (@formatter:off)
```java
public static final void positiveInt(ValidationScope<Integer> $context)   { … }
public static final void positiveLong(ValidationScope<Long> $context)     { … }
public static final void positiveDouble(ValidationScope<Double> $context) { … }
```
[//]: # (@formatter:on)

The Kotlin-side name `positive` exists only in the `@Metadata`; the JVM only ever sees the disambiguated names.

**`fun interface`** doesn't allocate a class per lambda.
`Translator { key, args -> … }` lowers to an `invokedynamic` call site backed by `LambdaMetafactory` — the same
machinery as a plain Kotlin/Java lambda, the runtime spins up the implementation on first use:

[//]: # (@formatter:off)
```java
// the `Translator { … }` becomes:
0: invokedynamic #40,  0   // InvokeDynamic #0:translate:()Lsure/Translator;
```
[//]: # (@formatter:on)

**Definitely-non-null types** mostly vanish.
`F & Any` erases to its ordinary bound — there's no special JVM type — so the guarantee is carried by `@Metadata` plus
the occasional `Intrinsics.checkNotNullParameter` guard the compiler drops in at a public boundary. At runtime it's a
plain non-null reference like any other.

### Metadata and reflection

Kotlin reflection reads from a hidden `@Metadata` annotation — protobuf-encoded type info (nullability, property kinds,
the things the JVM erases).
It's what lets `getOrCreateKotlinClass(User.class)` reconstruct the high-level `KClass<User>` the registry keys on.

## Case Closed

The library is, structurally, a type class: type-indexed dispatch (`validatorFor<T>()`), behavior parameterized by type,
and — via KSP — *derivation*.
Where the Scala version of this story leans on `Mirror`s and inductive `given`s, Kotlin gets there with context
parameters for composition, definitely-non-null types and contracts for safety, and a KSP code generator for the
derivation.

None of these features is exotic on its own.
Stacked together, they let Kotlin pull off the kind of type-level trick that used to be Scala's home turf.
The full source — multiplatform targets, every built-in check, the KSP processor, tests — is
at [github.com/halotukozak/sure](https://github.com/halotukozak/sure).
