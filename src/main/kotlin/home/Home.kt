package home

import basic.col
import basic.padding
import basic.row
import carousel.textCarousel
import kotlinx.html.*
import model.User
import tracks.completedTracks
import tracks.inProgressTracks

fun FlowContent.home(user: User) = row {
    col(xs = 12, sm = 12) {
        div("home-content") {
            row("flex-v-align") {
                homePhoto()
                homeText()
            }
            padding(20)
            technologies()
            completedTracks(user)
            inProgressTracks(user)
        }
    }
}


fun FlowContent.homePhoto() = col(sm = 12, md = 5, lg = 5) {
    div("home-photo") {
        div("hp-inner")
    }
}

fun FlowContent.homeText() = col(sm = 12, md = 7, lg = 7) {
    div("home-text hp-left") {
        textCarousel(
            "backend-developer",
            "computer science student",
            "Hyperskill moderator",
            "coffee enthusiast"
        )

        h1 { +"Bartłomiej Kozak" }
        p { +"Fusce tempor magna mi, non egestas velit ultricies nec. Aenean convallis, risus non condimentum gravida, odio mauris ullamcorper" }
        div("home-buttons") {
            a("#", target = "_blank", classes = "btn btn-primary") {
                +"Download CV"
            }
            a("#", target = "_self", classes = "btn btn-primary") {
                +"Contact"
            }
        }
    }
}

