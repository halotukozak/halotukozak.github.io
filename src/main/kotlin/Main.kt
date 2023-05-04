import basic.container
import basic.main
import home.home
import http.response.UserResponse
import kotlinx.browser.document
import kotlinx.coroutines.await
import kotlinx.dom.addClass
import kotlinx.html.TagConsumer
import kotlinx.html.div
import kotlinx.html.dom.append
import kotlinx.html.i
import kotlinx.html.js.div
import kotlinx.html.js.pre
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.w3c.fetch.RequestInit
import kotlin.js.json

suspend fun main() {

    val body = document.body!!

    val id = 243767975;
    val url = "https://hyperskill.org/api/users/$id"


    val userResponse: UserResponse = request(url)
    val user = userResponse.users[0]

    body.addClass("page")

    body.append {
        div("lm-animated-bg")
        scrollToTopButton()
        pre {
            user.toString()
        }
        container {
            main {
                home(user)
            }
        }
    }
}

private fun TagConsumer<*>.scrollToTopButton() = div("lmpixels-scroll-to-top") { i("lnr lnr-chevron-up") }

//class FetchError(message: String, status: Number, response: dynamic) : Error(message)
//
//suspend fun makeError(res: Response): FetchError {
//    return try {
//        val errorResponse: dynamic = res.json().await()
//        FetchError("Request failed", res.status, errorResponse)
//    } catch (e: Exception) {
//        val errorResponse = res.text().await()
//        FetchError("Request failed", res.status, errorResponse)
//    }
//}

suspend inline fun <reified T> request(url: String, method: String = "GET", body: dynamic = null): T {
    val res = kotlinx.browser.window.fetch("https://corsproxy.io/?url=$url", object : RequestInit {
        override var method: String? = method
        override var body: dynamic = body
        override var headers: dynamic = json(
            "Accept" to "application/json"
        )
    }).await().text().await()

    return Json.decodeFromString(res)
}