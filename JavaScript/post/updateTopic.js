const {createTopicPage, updateTopicPage} = require("../get/updateTopicPage")
const db = require("../lib/db")
const errorPage = require("../lib/errors")
const {isAdminOrOwner} = require("../lib/checkIfOwnerOrAdmin")

function updateTopic(request, response) {

    const TITLE_MIN_LENGTH = 1
    const TITLE_MAX_LENGTH = 64
    const CONTEXT_MIN_LENGTH = 0
    const CONTEXT_MAX_LENGTH = 512

    const topicTitle = request.body.title
    const topicContext = request.body.context
    const topicID = request.body.topicID
    let formErrors = []

    if (topicTitle.length < TITLE_MIN_LENGTH) {
        formErrors.push("The title must be at least " + TITLE_MIN_LENGTH + " character long.")
    }
    if (TITLE_MAX_LENGTH < topicTitle.length) {
        formErrors.push("The title must be at most " + TITLE_MAX_LENGTH + " character long")
    }
    if (topicContext.length < CONTEXT_MIN_LENGTH) {
        formErrors.push("The title must be at least " + CONTEXT_MIN_LENGTH + " character long.")
    }
    if (CONTEXT_MAX_LENGTH < topicContext.length) {
        formErrors.push("The title must be at most " + CONTEXT_MAX_LENGTH + " character long")
    }

    if (formErrors.length) {
        const args = {
            formErrors: formErrors,
            title: topicTitle,
            context: topicContext
        }
        updateTopicPage(request, response, args)
    } else {
        db.get(
            "select ownerID from topic where topicID = ?",
            [topicID],
            (err, topicDetails) => {
                if (err || !topicDetails) {
                    errorPage.internalServer(response)
                } else {
                    if (!isAdminOrOwner(request, topicDetails.ownerID)) {
                        errorPage.unauthorized(response)
                    } else {
                        console.log(topicTitle, topicContext)
                        db.run(
                            "update topic set title = ?, context = ? where topicID = ?",
                            [topicTitle, topicContext, topicID],
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
    }
}

module.exports = {updateTopic}