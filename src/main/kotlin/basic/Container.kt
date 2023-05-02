package basic

import header.header
import kotlinx.html.*

fun TagConsumer<*>.container(block: FlowContent.() -> Unit) =
    div("page-scroll") {
        div("page-container bg-move-effect") {
            header()
            block()
        }
    }

inline fun FlowContent.row(classes: String? = null, crossinline block: FlowContent.() -> Unit) =
    div("row " + (classes ?: "")) {
        block()
    }

inline fun FlowContent.col(
    xs: Int? = null,
    sm: Int? = null,
    md: Int? = null,
    lg: Int? = null,
    crossinline block: FlowContent.() -> Unit
) = div(classes = buildString {
    xs?.let { append(" col-xs-$xs") }
    sm?.let { append(" col-sm-$sm") }
    md?.let { append(" col-md-$md") }
    lg?.let { append(" col-lg-$lg") }
}) { block() }


inline fun FlowContent.main(crossinline block: FlowContent.() -> Unit = {}) = div("site-main") {
    div("single-page-content") {
        div("content-area") {
            div("page-content site-content single-post") {
                role = "main"
                block()
            }
        }
    }
}

fun FlowContent.padding(p: Int) =
    div("p-$p")

fun FlowContent.sectionTitle(title: String) =
    row { div("block-title") { h2 { +title } } }

