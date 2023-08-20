const errorPage = require("./errors")

const {renderPage} = require("./topic")

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
                response.redirect("/topic/" + topicID)
            }
        }
    )
}

module.exports = {addComment, editComment, deleteComment}