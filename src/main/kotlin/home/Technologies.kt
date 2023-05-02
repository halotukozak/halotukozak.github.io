package home

import basic.col
import basic.padding
import basic.row
import basic.sectionTitle
import kotlinx.html.*

fun FlowContent.technologies() = row {
    col(xs = 12, sm = 12) {
        sectionTitle("Technologies")

        div("technologies owl-carousel") {
            attributes["data-mobile-items"] = "1"
            attributes["data-tablet-items"] = "3"
            attributes["data-items"] = "10"

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
                    a {
                        href = "#"
                        target = "_blank"
                        title = technologyName
                        img {
                            src = "./img/technologies/$technologyName.svg"
                            alt = technologyName
                        }
                    }
                }
            }
        }
    }
}