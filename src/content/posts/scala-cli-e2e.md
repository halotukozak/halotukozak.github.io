---
title: 'scala-cli E2E Repo Setup'
published: 2026-03-02
draft: false
tags: [ 'scala', 'scala-cli', 'devops' ]
toc: true
---

## Why scala-cli?

Every time I start a new Scala project, I find myself googling the same setup steps — formatting, testing, coverage,
publishing, documentation. The traditional tools don't help: `sbt` has a steep learning curve, `Mill` is fast but
struggles with IntelliJ support. `scala-cli` bridges this gap — as simple as a script but as capable as a build tool,
with first-class IDE support that actually works.

This post is the reference I wish I had: a complete copy-paste workflow for a small library, using only `scala-cli`.
Maybe it'll save you the same googling.

## The Basics

A minimal `scala-cli` library project may look like this:

```
my-library/
├── project.scala
├── .scalafmt.conf
├── src/
│   └── MyLib.scala
├── test/
│   └── MyLibTest.scala
└── .scoverage/
    └── report.sc
```

Your configuration lives *inside* your source files using "directives". However, as your project grows, you can
consolidate these into a single file named `project.scala`.
Directives cover the Scala version, dependencies (both main and test-only), and compiler options — all in one place:

```scala title="project.scala"
//> using scala 3.8.2
//> using test.dep org.scalameta::munit::1.2.3

//> using options -deprecation -feature -new-syntax -unchecked
//> using options -language:noAutoTupling
//> using options -Yexplicit-nulls
//> using options -Wsafe-init -Werror -Wunused:all
```

`scala-cli` will automatically download the Scala compiler and dependencies, compile all files in the directory, and
execute the entry point.

### IDE Support

If you're using VS Code (with Metals) or IntelliJ, `scala-cli` works out of the box. If you ever feel the IDE is out of
sync, run:

```bash
scala-cli --power setup-ide .
```

### Formatting with Scalafmt

Consistent code style is non-negotiable. `scala-cli` has built-in support for `scalafmt`.

To format your code:

```bash
scala-cli fmt .
```

If you want to customize the style, create a `.scalafmt.conf` file in your root directory. `scala-cli` will pick it up
automatically. You can also enforce formatting in CI:

```bash
scala-cli fmt . --check
```

### Testing

Testing doesn't require a separate build module. Just create a `*.test.scala` file or put your tests in a `tests/`
directory.

For example, create `MyTests.test.scala`:

```scala 3 title="MyTests.test.scala"
class MyTests extends munit.FunSuite {
  test("math works") {
    assertEquals(1 + 1, 2)
  }
}
```

Run all tests in the current directory:

```bash
scala-cli test .
```

`scala-cli` is smart enough to include test-only dependencies only when running the `test` command.

## Code Coverage

`scala-cli` doesn't have a native `coverage` command. My approach here uses the Scala 3 compiler's built-in coverage
instrumentation directly, with a custom report script that gives you full control. This is exactly how it's done in
the [made](https://github.com/halotukozak/made) project.

### How Scala 3 coverage instrumentation works

The Scala 3 compiler has a built-in coverage phase. When you pass `-coverage-out:<dir>`, the compiler does two things
during compilation:

1. **Writes `scoverage.coverage`** — a serialized file describing every instrumentable statement in your source code:
   its location, source file, line number, and a unique ID. This is the _coverage map_.

2. **Injects measurement calls** into the compiled bytecode. Every instrumented statement gets a
   `Invoker.invoked(id, dataDir)` call that writes a tiny file (`scoverage.measurements.{id}`) to `<dir>` at runtime.
   Each file's existence proves that statement was executed.

After `scala-cli test .` finishes, the output directory contains the coverage map and a measurement file for every
statement that was hit during the test run. The report step is just: deserialize the map, scan which measurement files
exist, compute the ratio.

### Report Generation

1. Add coverage directives to `project.scala`:

    ```scala title="project.scala"
    //> using options -coverage-out:./.scoverage
    ```

   `-coverage-out:./.scoverage` tells the compiler where to write both the coverage map and the runtime measurement
   files.
   Everything lands in `.scoverage/`.

2. Run tests:

    ```bash
    scala-cli test .
    ```

   After this, `.scoverage/` contains `scoverage.coverage` (the map) and `scoverage.measurements.*` files (one per
   executed
   statement).

3. Generate the report:

   I depend on the scoverage library directly and have written a simple Scala script:

    ```scala 3 title=".scoverage/report.sc"
    //> using scala 3.8.2
    //> using dep org.scoverage::scalac-scoverage-reporter:2.5.2
    //> using dep org.scoverage::scalac-scoverage-domain:2.5.2
    //> using dep org.scoverage::scalac-scoverage-serializer:2.5.2
    
    import scoverage.reporter.{ScoverageHtmlWriter, CoberturaXmlWriter, IOUtils}
    import scoverage.serialize.Serializer
    import java.io.File
    
    val coverageFile = new File(".scoverage/scoverage.coverage")
    val sourceDir = new File(".")
    val measurementDir = new File(".scoverage")
    val outDir = new File(".scoverage/report")
    
    if !coverageFile.exists() then
      println(s"Error: Coverage file not found at ${coverageFile.getAbsolutePath}")
      sys.exit(1)
    
    val coverage = Serializer.deserialize(coverageFile, sourceDir)
    val measurementFiles = IOUtils.findMeasurementFiles(measurementDir)
    coverage.apply(IOUtils.invoked(measurementFiles.toIndexedSeq))
    
    outDir.mkdirs()
    
    ScoverageHtmlWriter(Seq(sourceDir), outDir, None).write(coverage)
    CoberturaXmlWriter(Seq(sourceDir), outDir, None).write(coverage)
    
    println(s"Statement coverage: ${coverage.statementCoverageFormatted}%")
    ```

   Run it with `scala-cli .scoverage/report.sc`.

   This is the "deserialize, scan, compute" step from above — `Serializer.deserialize` loads the coverage map,
   `IOUtils.findMeasurementFiles` collects which statements were hit, and the two writers produce the output:

    - `ScoverageHtmlWriter` — browsable HTML where you can click into each source file and see covered (green) vs
      uncovered (red) lines.
    - `CoberturaXmlWriter` — `cobertura.xml`, the standard format that CI tools understand.

### CI integration

In GitHub Actions, the coverage step chains naturally after `scala-cli test`:

```yaml
- run: scala-cli --power test .
- run: scala-cli .scoverage/report.sc
- name: Code Coverage Report
  uses: 5monkeys/cobertura-action@master
  continue-on-error: true
  with:
    path: .scoverage/report/cobertura.xml
    minimum_coverage: 80
```

`scala-cli test .` runs with instrumentation (because `-coverage-out` is in `project.scala`), the report script
generates `cobertura.xml`, and `cobertura-action` posts the coverage summary directly on the PR — no external service
or token needed.

## Publishing to Maven Central

Yes, you can publish libraries to Maven Central (or any repo) using `scala-cli`. This requires the `--power` flags.

First, add publishing metadata to your `project.scala`:

```scala title="project.scala"
//> using publish.organization com.example
//> using publish.name my-library
//> using publish.computeVersion git:tag
//> using publish.description "My awesome Scala library"
//> using publish.url https://github.com/yourname/my-library
//> using publish.license Apache-2.0
//> using publish.vcs github:yourname/my-library
//> using publish.repository central
//> using publish.developer "yourname|Your Name|https://github.com/yourname"
```

`computeVersion git:tag` derives the version from the latest git tag — push `v0.1.0` and the published artifact is
`0.1.0`. No version string to update manually.

### PGP Key Setup

Maven Central requires all artifacts to be PGP-signed. `scala-cli` can generate a key pair for you:

```bash
scala-cli --power config --create-pgp-key --email your@email.com
```

This creates a PGP key and stores it in your local `scala-cli` config. For CI, you need to export the private key and
passphrase as repository secrets. If you prefer using GPG directly:

```bash
gpg --gen-key
gpg --armor --export-secret-keys YOUR_KEY_ID  # → store as PGP_PRIVATE_KEY secret
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
```

You'll need four secrets in your CI environment: `SONATYPE_USERNAME`, `SONATYPE_PASSWORD`, `PGP_PRIVATE_KEY`, and
`PGP_PASSPHRASE`. The Sonatype credentials come
from [creating an account on Central Portal](https://central.sonatype.com/) — after verifying your namespace (e.g.
`io.github.yourname` via GitHub), generate a user token.

### Running the publish command

```bash
# To a local repository (for testing)
scala-cli --power publish local .

# To Sonatype/Maven Central
scala-cli --power publish . --verbose \
  --user "env:SONATYPE_USERNAME" \
  --password "env:SONATYPE_PASSWORD" \
  --secret-key "env:PGP_PRIVATE_KEY" \
  --secret-key-password "env:PGP_PASSPHRASE"
```

The `"env:..."` syntax tells `scala-cli` to read from environment variables rather than passing secrets as arguments.

## GitHub Actions Integration

`scala-cli` is perfect for CI because it's lightweight. Here's the full CI workflow from `made` — two parallel jobs for
formatting and tests (including the coverage pipeline from Section 4):

```yaml title=".github/workflows/ci.yml"
name: Run CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Scalafmt
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: coursier/cache-action@v8.0
      - uses: VirtusLab/scala-cli-setup@v1
      - run: scala-cli --power fmt --check .

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: coursier/cache-action@v8.0
      - uses: VirtusLab/scala-cli-setup@v1
      - run: scala-cli --power test .
      - run: scala-cli .scoverage/report.sc
      - name: Code Coverage Report
        uses: 5monkeys/cobertura-action@master
        continue-on-error: true
        with:
          path: .scoverage/report/cobertura.xml
          minimum_coverage: 80
      - run: scala-cli --power doc .
```

`fetch-depth: 0` is needed because `publish.computeVersion git:tag` requires the full git history to derive the version.
`coursier/cache-action` caches downloaded JVMs and dependencies between runs. The `doc` step at the end validates that
Scaladoc generates without errors — a cheap smoke test for documentation quality.

The publish workflow triggers on version tags:

```yaml title=".github/workflows/publish.yml"
name: Publish
on:
  push:
    tags: [ 'v*' ]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: coursier/cache-action@v8.0
      - uses: VirtusLab/scala-cli-setup@v1
      - run: |
          scala-cli --power publish . --verbose \
            --user "env:SONATYPE_USERNAME" \
            --password "env:SONATYPE_PASSWORD" \
            --secret-key "env:PGP_PRIVATE_KEY" \
            --secret-key-password "env:PGP_PASSPHRASE"
        env:
          SONATYPE_USERNAME: ${{ secrets.SONATYPE_USERNAME }}
          SONATYPE_PASSWORD: ${{ secrets.SONATYPE_PASSWORD }}
          PGP_PRIVATE_KEY: ${{ secrets.PGP_PRIVATE_KEY }}
          PGP_PASSPHRASE: ${{ secrets.PGP_PASSPHRASE }}
```

Push a tag, artifact lands on Maven Central. That's it.

## Documentation Generation

`scala-cli` can generate Scaladoc with a single command:

```bash
scala-cli --power doc .
```

This produces a `scala-doc/` directory with browsable HTML documentation. For a library, you'll want to pass additional
flags to the Scaladoc tool after `--`:

```bash
scala-cli --power doc . -- \
  -project "My Library" \
  -project-version v0.1.0 \
  -snippet-compiler:compile \
  -source-links:"src=github://yourname/my-library?tag=v0.1.0"
```

`-snippet-compiler:compile` compiles code snippets in `@example` blocks during generation — broken examples fail the
build, not the reader. `-source-links` adds clickable "Source" links from the docs back to your GitHub repository at
the right tag.

In CI, running `scala-cli --power doc .` without extra flags is a cheap smoke test — if any Scaladoc comment has a
syntax error or a broken `@example` snippet, the build fails.

One caveat: if your project uses Scala 3 macros, `scala-cli doc .` may fail because the Scaladoc compiler tries to
expand them in a context where they can't run. There's no clean workaround yet — for now, you may need to exclude
macro-heavy files from documentation generation.

### Deploying to GitHub Pages

In case you would like to deploy Scaladoc to GitHub Pages on every version tag, here's the workflow.

```yaml title=".github/workflows/docs.yaml"
name: Deploy documentation to Pages

on:
  push:
    tags: [ 'v*' ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: coursier/cache-action@v8.0
      - uses: VirtusLab/scala-cli-setup@v1
      - name: Generate documentation
        run: |
          scala-cli --power doc . -- \
          -project "M&DE" \
          -project-version ${{ github.ref_name }} \
          -project-footer "made with ❤️ and coffee" \
          -social-links:github::https://github.com/halotukozak/made \
          -snippet-compiler:compile \
          -source-links:"src=github://halotukozak/made?tag=${{ github.ref_name }}" \
          -revision:${{ github.ref_name }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: 'scala-doc'
      - uses: actions/deploy-pages@v4
```

`${{ github.ref_name }}` injects the git tag (e.g. `v0.1.0`) into the project version and source links, so every
tagged release gets documentation with correct versioned links back to the source. `-social-links:github::` adds a
GitHub icon linking to the repository. `-revision` anchors source links to the exact commit.

Push a tag — docs land on GitHub Pages automatically, right alongside the Maven Central publish.

## Extra: Testing Across JVM Versions

One of the most powerful features of `scala-cli` is its ability to manage JVM installations automatically. Testing your
code against multiple Java versions is a one-liner:

```bash
# Run tests on Java 11
scala-cli test . --jvm 11
```

You don't need `sdkman` or manually managed `$JAVA_HOME`. `scala-cli` uses [coursier](https://get-coursier.io/) to
download the requested JVM under the hood, ensuring your tests are reproducible across different environments. You can
also pin the version in your `project.scala`:

```scala
//> using jvm 21
```

## Wrapping Up

`scala-cli` is no longer just a "scripting tool". It's a robust, fast, and modern way to build Scala applications.
Whether you're writing a simple automation script or a published library, `scala-cli` provides a seamless E2E experience
without the overhead of traditional build tools.

## References

- [Official scala-cli Documentation](https://scala-cli.virtuslab.org/)
- [M&DE Repository](https://github.com/halotukozak/made) — the project used as the example throughout this post
- [Scala 3 Compiler Options](https://docs.scala-lang.org/scala3/guides/migration/options-lookup.html)
- [VirtusLab's GitHub Actions Setup](https://github.com/VirtusLab/scala-cli-setup)
- [Scoverage](https://github.com/scoverage/scalac-scoverage-plugin)
- [Scala 3 Scaladoc](https://docs.scala-lang.org/scala3/guides/scaladoc/)
