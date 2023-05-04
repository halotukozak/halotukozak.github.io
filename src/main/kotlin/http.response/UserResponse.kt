package http.response

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import model.User

@Serializable
data class UserResponse(val meta: Meta, val users: List<User>)

@Serializable
data class Meta(
    val page: Int,
    @SerialName("has_next") val hasNext: Boolean,
    @SerialName("has_previous") val hasPrevious: Boolean
)