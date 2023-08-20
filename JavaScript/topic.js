const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("./errors")
const mainModel = require("./mainModel")
const user = require("./user")
const {DELETED_USER_TITLE} = require("./index")

const ADMIN_ROLE_ID = 2

function isOwner(request, ownerID) {
    return ownerID && ownerID == request.session.accountID
}

function isAdminOrOwner(request, ownerID) {
    return request.session.roleID == ADMIN_ROLE_ID || isOwner(request, ownerID)
}

function renderPage(request, response, args, topicID) {
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
                let initials = user.getInitials(topicData.username, topicData.nickname)
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
                                comments[i].initials = user.getInitials(comments[i].username, comments[i].nickname)
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

function deleteTopic(request, response) {
    const topicID = request.body.topicID
    const requesterID = request.session.accountID

    db.run(
        "delete from topic where topicID = ? and ownerID = ?",
        [topicID, requesterID],
        (err) => {
            if (err) {
                errorPage.internalServer(response)

            } else {
                response.redirect("/")
            }
        }
    )
}

module.exports = {renderPage, deleteTopic}