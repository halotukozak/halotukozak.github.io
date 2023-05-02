package tracks

import kotlinx.html.FlowContent
import model.User

fun FlowContent.completedTracks(user: User) = tracks("Completed tracks", user.completedTracks)