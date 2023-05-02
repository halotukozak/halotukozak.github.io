package carousel

import kotlinx.html.FlowContent
import kotlinx.html.div
import kotlinx.html.style

inline fun FlowContent.textCarousel(vararg texts: String, crossinline block: FlowContent.() -> Unit = {}) =
    div("text-rotation text-carousel") {
        texts.forEachIndexed { index, text ->
            div("text-carousel-item item") {
                style = "animation-delay: ${index * 2}s"
                +text
            }
        }
    }



