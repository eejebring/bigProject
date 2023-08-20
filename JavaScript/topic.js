const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("./errors")
const mainModel = require("./layout")
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

function addComment(request, response) {
    const COMMENT_MAX_LENGTH = 255
    const COMMENT_MIN_LENGTH = 1

    const topicID = request.body.topicID
    const userID = request.session.accountID
    const content = request.body.commentContent

    let formErrors = []

    if (COMMENT_MAX_LENGTH < content.length) {
        formErrors.push("Comments can at most be " + COMMENT_MAX_LENGTH + " characters long.")
    }
    if (content.length < COMMENT_MIN_LENGTH) {
        formErrors.push("Comments can at least be " + COMMENT_MIN_LENGTH + " characters long.")
    }

    if (!formErrors.length) {
        db.run(
            "insert into comment (ownerID, topicID, content) VALUES (?,?,?)",
            [userID, topicID, content],
            (err) => {
                if (err) {
                    errorPage.internalServer(response)
                } else {
                    response.redirect("/topic/" + topicID)
                }
            }
        )
    } else {
        renderPage(request, response, {formErrors}, topicID)
    }
}

function editComment() {

}

function deleteComment(request, response) {
    const topicID = request.body.topicID
    const requesterID = request.session.accountID
    const commentID = request.body.commentID

    db.run(
        "delete from comment where commentID = ? and ownerID = ?",
        [commentID, requesterID],
        (err) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                response.redirect("/topic:" + topicID)
            }
        }
    )
}

module.exports = {renderPage, addComment, deleteTopic, deleteComment}