package tracks

import basic.col
import basic.row
import basic.sectionTitle
import model.Track
import react.RBuilder
import react.dom.div
import react.dom.h4
import request


fun RBuilder.tracks(title: String, tracks: List<Track>) =
    row {
        col(xs = 12, sm = 12) {
            sectionTitle(title)

            for (track in tracks) {
                div("skills-info skills-first-style") {
                    div("clearfix") {
                        h4 { +track.toString() }
                        div("skill-value") { +"""$track%""" }
                    }
                    div("skill-container") {
                        attrs["data-value"] = "$track"
                        div("skill-percentage") {
                        }
                    }
                }
            }
        }
    }


