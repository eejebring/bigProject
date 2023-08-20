const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
const mainModel = require("../lib/mainModel")
const user = require("./accountPage")
const {DELETED_USER_TITLE} = require("./indexPage")
const {getInitials} = require("../lib/getInitials")
const {isOwner} = require("../lib/checkIfOwner")
const {isAdminOrOwner} = require("../lib/checkIfOwnerOrAdmin")

function topicPage(request, response, args, topicID) {
    if (!topicID) {
        topicID = parseInt(request.params.ID)
    }
    db.get(
        "select topicID, accountID, title, context, age, username, nickname from topic left join account a on a.accountID = topic.ownerID where topicID = ?",
        [topicID],
        (err, topicData) => {
            if (err) {
                errorPage.internalServer(response)
            } else if (topicData == null) {
                errorPage.badRequest(response)
            } else {
                let initials = getInitials(topicData.username, topicData.nickname)
                if (!topicData.username) {
                    topicData.username = DELETED_USER_TITLE
                }
                db.all(
                    "select content, username, nickname, ownerID, commentID from comment join account on ownerID = accountID where topicID = ?",
                    [topicID],
                    (err, comments) => {
                        if (err) {
                            errorPage.internalServer(response)
                        } else {
                            for (let i = 0; i < comments.length; i++) {
                                comments[i].initials = getInitials(comments[i].username, comments[i].nickname)
                                if (comments[i].username) {
                                    comments[i].canDeleteComment = isAdminOrOwner(request, comments[i].ownerID)
                                } else {
                                    comments[i].username = DELETED_USER_TITLE
                                }
                            }
                            const model = {
                                ...args,
                                ...mainModel(request),
                                ...topicData,
                                initials: initials,
                                canDeleteTopic: isAdminOrOwner(request, topicData.accountID),
                                comments: comments
                            }
                            response.render("pages/topic.hbs", model)
                        }
                    }
                )
            }
        }
    )
}

module.exports = {topicPage}