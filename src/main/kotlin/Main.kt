import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.coroutines.await
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.w3c.fetch.RequestInit
import react.RBuilder
import react.create
import react.dom.client.createRoot
import react.dom.div
import react.dom.i
import kotlin.js.json


fun main() {
    val container = document.getElementById("root") ?: error("Cannot find body")
    createRoot(container).render(App.create())
    val id = 243767975;


}



suspend inline fun <reified T> request(url: String, method: String = "GET", body: dynamic = null): T {

    val res = window.fetch(
        "https://corsproxy.io/?url=https://hyperskill.org/api/$url",
        object : RequestInit {
            override var method: String? = method
            override var body: dynamic = body
            override var headers: dynamic = json(
                "Accept" to "application/json"
            )
        }).await().text().await()


    return Json.decodeFromString(res)
}


