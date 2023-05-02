package carousel

import kotlinx.html.*

fun FlowContent.blockCarousel(blocks: List<() -> Unit>) = DIV(
    attributesMapOf(
        "classes",
        "technologies owl-carousel",
        "data-mobile-items",
        "1",
        "data-tablet-items",
        "3",
        "data-items",
        "6"
    ), consumer
).visit {
    for (block in blocks) {
        div("technology-block") { block() }
    }
}