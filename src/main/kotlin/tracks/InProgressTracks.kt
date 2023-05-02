package tracks

import kotlinx.html.FlowContent
import model.User

fun FlowContent.inProgressTracks(user: User) = tracks("Tracks in progress", user.completedTracks)
