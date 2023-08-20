const errorPage = require("../lib/errors")
const db = require("../lib/db")


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

module.exports = {deleteComment}