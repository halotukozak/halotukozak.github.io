package home

import basic.col
import basic.padding
import basic.row
import basic.sectionTitle
import carousel.blockCarousel
import kotlinx.html.FlowContent
import kotlinx.html.a
import kotlinx.html.img
import kotlinx.html.title

fun FlowContent.technologies() = row {
    col(xs = 12, sm = 12) {
        padding(20)
        sectionTitle("Technologies")

        row {
            col(xs = 12, sm = 3) {

                blockCarousel(
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
                        {
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
                    })
            }
        }
    }
}
