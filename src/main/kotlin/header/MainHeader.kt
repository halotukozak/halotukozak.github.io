package header

import kotlinx.html.*

fun FlowContent.header() = header("header") {
    div("text-logo") {
        a("index.html") {
            div("logo-text") {
                +"Bartłomiej"
                span { +" Kozak" }
            }
        }
    }
    nav()
    a(classes = "menu-toggle mobile-visible") {
        i("fa fa-bars")
    }
}

fun FlowContent.nav() = div("site-nav mobile-menu-hide") {
    ul("leven-classic-menu site-main-menu") {
        menuItem("About me", "current-menu-item")
        repeat(3) {
            menuItem("Resume")
        }
    }
}

fun UL.menuItem(href: String, classes: String? = null) {
    li("menu-item " + (classes ?: "")) {
        a { +href }
    }
}
