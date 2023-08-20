const mainModel = require("../lib/mainModel")
const errorPage = require("../lib/errors")
const db = require("../lib/db")

function updateCommentPage(request, response, args, commentID) {
    if (!commentID) {
        commentID = parseInt(request.params.ID)
    }

    db.get(
        "select content from comment where commentID = ?",
        [commentID],
        (err, commentDetails) => {
            if (err || !commentDetails) {
                errorPage.internalServer(response)
            } else {
                const model = {
                    ...args,
                    ...mainModel(request),
                    commentID,
                    content: commentDetails.content,
                    pageTitle: "Update Comment"
                }
                response.render("pages/updateComment.hbs", model)
            }
        })
}

module.exports = {updateCommentPage}