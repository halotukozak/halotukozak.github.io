package carousel

import react.RBuilder
import react.dom.div
import react.dom.style

fun RBuilder.textCarousel(vararg texts: String) =
    div("text-carousel") {
        texts.forEachIndexed { index, text ->
            div("text-carousel-item item") {
                style("animation-delay: ${index * 2}s")
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



