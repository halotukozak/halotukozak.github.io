package carousel

import kotlinx.html.FlowContent
import kotlinx.html.div
import kotlinx.html.style

inline fun FlowContent.textCarousel(vararg texts: String, crossinline block: FlowContent.() -> Unit = {}) =
    div("text-carousel") {
        texts.forEachIndexed { index, text ->
            div("text-carousel-item item") {
                style = "animation-delay: ${index * 2}s"
                +text
            }
        }
//        style {
//            +"""@keyframes display {
//    0% {
//        transform: translateX(100px);
//        opacity: 0;
//    }
//    10% {
//        transform: translateX(0);
//        opacity: 1;
//    }
//    20% {
//        transform: translateX(0);
//        opacity: 1;
//    }
//    30% {
//        transform: translateX(-50px);
//        opacity: 0;
//    }
//    100% {
//        transform: translateX(-50px);
//        opacity: 0;
//    }
//}
//
//.text-carousel {
//    position: relative;
//}
//
//.text-carousel > .text-carousel-item {
//    opacity: 0;
//    bottom: 0;
//    position: absolute;
//    animation: display 8s infinite;
//}
//"""
//        }
    }



