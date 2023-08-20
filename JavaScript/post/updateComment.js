const db = require("../lib/db")
const errorPage = require("../lib/errors")
const {topicPage} = require("../get/topicPage")
const {isAdminOrOwner} = require("../lib/checkIfOwnerOrAdmin")

function updateComment(request, response) {
    const COMMENT_MAX_LENGTH = 255
    const COMMENT_MIN_LENGTH = 1

    const topicID = request.body.topicID
    const content = request.body.commentContent
    const commentID = request.body.commentID

    let formErrors = []

    if (COMMENT_MAX_LENGTH < content.length) {
        formErrors.push("Comments can at most be " + COMMENT_MAX_LENGTH + " characters long.")
    }
    if (content.length < COMMENT_MIN_LENGTH) {
        formErrors.push("Comments can at least be " + COMMENT_MIN_LENGTH + " characters long.")
    }

    if (!formErrors.length) {
        db.run(
            "select ownerID from comment where commentID = ?"
                [commentID],
            (err, topicDetails) => {
                if (err) {
                    errorPage.internalServer(response)
                } else {
                    if (!isAdminOrOwner(request, topicDetails.ownerID)) {
                        errorPage.unauthorized(response)
                    } else {
                        db.run(
                            "update comment set content = ? where commentID = ?",
                            [content, commentID],
                            (err) => {
                                if (err) {
                                    errorPage.internalServer(response)
                                } else {
                                    response.redirect("/topic/" + topicID)
                                }
                            })
                    }
                }
            })
    } else {
        topicPage(request, response, {formErrors}, topicID)
    }
}

module.exports = {updateComment}