import basic.container
import basic.main
import io.ktor.client.*
import io.ktor.client.engine.js.*
import io.ktor.client.fetch.*
import io.ktor.client.request.*
import kotlinx.browser.document
import kotlinx.browser.window
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
import org.w3c.fetch.NO_CORS
import org.w3c.fetch.RequestMode
import kotlin.js.json

suspend fun main() {

    val body = document.body!!

    val id = 243767975;
    val url = "https://hyperskill.org/api/users/$id"


    val client = HttpClient(Js)
    val res = client.get(url)
    console.log(res)

    body.addClass("page")

    body.append {
        div("lm-animated-bg")
        scrollToTopButton()

        container {
            main {
//                home(user)
                pre {
//                    +user.toString()
                }
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
    val res = window.fetch(url, object : RequestInit {
        override var method: String? = method
        override var body: dynamic = body
        override var mode: RequestMode? = RequestMode.NO_CORS
        override var headers: dynamic = json(
            "Accept" to "application/json",
        )
    }).await().text().await()

    console.log(res)
    return Json.decodeFromString(res)
}