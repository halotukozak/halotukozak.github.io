package tracks

import getTracks
import model.User
import react.RBuilder

fun RBuilder.inProgressTracks(user: User) = tracks("Tracks in progress", getTracks(user.completedTracks))
