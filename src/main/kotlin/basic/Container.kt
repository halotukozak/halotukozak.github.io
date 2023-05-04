package basic

import kotlinx.html.role
import react.RBuilder
import react.dom.attrs
import react.dom.div
import react.dom.h2


inline fun RBuilder.container(crossinline block: RBuilder.() -> Unit) = div("page-scroll") {
    div("page-container bg-move-effect") {
        block()
    }
}


inline fun RBuilder.main(crossinline block: RBuilder.() -> Unit) {
    div("site-main") {
        div("single-page-content") {
            div("content-area") {
                div("page-content site-content single-post") {
                    attrs {
                        role = "main"
                    }
                    block()
                }
            }
        }
    }
}


inline fun RBuilder.row(
    classes: String? = null,
    crossinline block: RBuilder.() -> Unit
) = div("row " + (classes ?: "")) { block() }


inline fun RBuilder.col(
    xs: Int? = null,
    sm: Int? = null,
    md: Int? = null,
    lg: Int? = null,
    crossinline block: RBuilder.() -> Unit
) = div(classes = buildString {
    xs?.let { append(" col-xs-$xs") }
    sm?.let { append(" col-sm-$sm") }
    md?.let { append(" col-md-$md") }
    lg?.let { append(" col-lg-$lg") }
}) { block() }


fun RBuilder.padding(p: Int) = div("p-$p") {}

fun RBuilder.sectionTitle(title: String) = row { div("block-title") { h2 { +title } } }


