import basic.col
import basic.container
import basic.main
import basic.row
import home.home
import kotlinx.browser.document
import kotlinx.dom.addClass
import kotlinx.html.TagConsumer
import kotlinx.html.div
import kotlinx.html.dom.append
import kotlinx.html.i
import kotlinx.html.js.div

fun main() {
    val body = document.body!!
    body.addClass("page")

    body.append {
        div("lm-animated-bg")
        scrollToTopButton()

        container {
            main {
                home()


            }
        }
    }
}


private fun TagConsumer<*>.scrollToTopButton() = div("lmpixels-scroll-to-top") { i("lnr lnr-chevron-up") }



