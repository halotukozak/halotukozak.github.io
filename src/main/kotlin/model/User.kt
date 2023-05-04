package model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val avatar: String,
    @SerialName("badge_title")
    val badgeTitle: String,
    val bio: String,
    @SerialName("fullname")
    val fullName: String,
    val gamification: Gamification,
    @SerialName("invitation_code")
    val invitationCode: String,
    @SerialName("comments_posted")
    val commentsPosted: Map<String, Int>,
    val username: String,
    @SerialName("completed_tracks")
    val completedTracks: List<Int>,
    val country: String,
    val languages: List<String>,
    val experience: String,
    @SerialName("github_username")
    var githubUsername: String,
    @SerialName("linkedin_username")
    val linkedinUsername: String,
    @SerialName("twitter_username")
    val twitterUsername: String,
    @SerialName("reddit_username")
    val redditUsername: String,
    @SerialName("facebook_username")
    val facebookUsername: String,
    @SerialName("discord_username")
    val discordUsername: String,
    @SerialName("discord_id")
    val discordId: String,
    val visibility: String,
    val cover: String
) {
}

@Serializable
data class Gamification(
    @SerialName("active_days") val activeDays: Int,
    @SerialName("daily_step_completed_count") val dailyStepCompletedCount: Int,
    @SerialName("passed_problems") val passedProblems: Int,
    @SerialName("passed_projects") val passedProjects: Int,
    @SerialName("passed_topics") val passedTopics: Int,
    @SerialName("progress_updated_at") val progressUpdatedAt: String,
)
