import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig.*


plugins {
    kotlin("js") version "1.7.10"
    kotlin("plugin.serialization") version "1.7.10"
}

group = "halotukozak.github.io"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    js {
        binaries.executable()
        browser {
            commonWebpackConfig {
                mode = if(project.hasProperty("prod")) Mode.PRODUCTION else Mode.DEVELOPMENT
            }
        }
    }
}

dependencies {
    // React, React DOM + Wrappers
    implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.354"))
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.3")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.3")
    implementation(kotlin("stdlib-jdk8"))
}
tasks.named("developmentExecutableCompileSync") {
    dependsOn("browserDevelopmentRun")
}