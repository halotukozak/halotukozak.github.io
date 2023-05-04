package tracks

import getTracks
import kotlinx.html.FlowContent
import model.User
import react.RBuilder

fun RBuilder.completedTracks(user: User) = tracks("Completed tracks", getTracks(user.completedTracks))
