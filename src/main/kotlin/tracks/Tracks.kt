package tracks

import basic.col
import basic.row
import basic.sectionTitle
import kotlinx.browser.window
import kotlinx.coroutines.await
import kotlinx.html.FlowContent
import kotlinx.html.div
import kotlinx.html.h4
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import model.Track

fun FlowContent.tracks(title: String, tracks: List<Int>) = row {
    col(xs = 12, sm = 12) {
        sectionTitle(title)


        for (track in tracks) {
            div("skills-info skills-first-style") {
                div("clearfix") {
                    h4 { +track.toString() }
                    div("skill-value") { +"""$track%""" }
                }
                div("skill-container") {
                    attributes["data-value"] = "$track"
                    div("skill-percentage") {
                    }
                }
            }
        }
    }
}

suspend fun getTracks(id: Int): List<Track> {
    val response = window
        .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
        .await()
        .text()
        .await()
    return Json.decodeFromString(response)
}