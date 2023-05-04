package home

import basic.col
import basic.row
import basic.sectionTitle
import react.RBuilder
import react.dom.a
import react.dom.div
import react.dom.img

fun RBuilder.technologies() = row {
    col(xs = 12, sm = 12) {
        sectionTitle("Technologies")

        div("technologies owl-carousel") {
            attrs["data-mobile-items"] = "1"
            attrs["data-tablet-items"] = "3"
            attrs["data-items"] = "10"

            listOf(
                "Kotlin",
                "Java",
                "spring",
                "GitHub",
                "python",
                "matplotlib",
                "Laravel",
                "Gradle",
                "Bash",
                "C"
            ).map { technologyName ->
                div("technology-block") {
                    a(href = "#", target = "_blank") {
                        img(
                            src = "./img/technologies/$technologyName.svg",
                            alt = technologyName
                        ) {
                        }
                    }
                }
            }
        }
    }
}