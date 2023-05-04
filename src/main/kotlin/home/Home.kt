package home

import basic.col
import basic.padding
import basic.row
import carousel.textCarousel
import model.User
import react.RBuilder
import react.dom.a
import react.dom.div
import react.dom.h1
import react.dom.p
import tracks.completedTracks

fun RBuilder.home(user: User) =
    row {
        col(xs = 12, sm = 12) {
            div("home-content") {
                row("flex-v-align") {
                    homePhoto()
                    homeText()
                }
                padding(20)
                technologies()

                completedTracks(user)

//            inProgressTracks(user)
            }
        }
    }


fun RBuilder.homePhoto() = col(sm = 12, md = 5, lg = 5) {
    div("home-photo") {
        div("hp-inner") {}
    }
}

fun RBuilder.homeText() = col(sm = 12, md = 7, lg = 7) {
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








