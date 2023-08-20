const errorPage = require("../lib/errors")
const db = require("../lib/db")

const {renderPage} = require("../get/topicPage")

function createComment(request, response) {
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

module.exports = {createComment}