import basic.container
import basic.main
import header.header
import home.home
import http.response.UserResponse
import kotlinx.coroutines.MainScope
import model.Track
import model.User
import react.Props
import react.RBuilder
import react.RComponent
import react.State
import react.dom.div
import react.dom.i


val mainScope = MainScope()

external interface AppState : State {
    var user: User
}

class App : RComponent<Props, AppState>() {
    override fun RBuilder.render() {
        div("lm-animated-bg") {}

        scrollToTopButton()

        container {
            header()

            main {
                home(state.user)
            }
        }

    }


    private fun RBuilder.scrollToTopButton() = div("lmpixels-scroll-to-top") { i("lnr lnr-chevron-up") {} }

    override fun AppState.init() {
        val userResponse: UserResponse = request("users/$id")
        setState{
            user = userResponse.users[0]("Not yet implemented")
        }
    }


    fun getTracks(id: List<Int>): List<Track> = request("/tracks?=" + id.joinToString(","))

}

fun RBuilder.app() = child(App::class) {}