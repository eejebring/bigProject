const errorPage = require("../lib/errors")
const {renderPage} = require("../get/createTopicPage")
const db = require("../lib/db")

function createTopic(request, response) {
    const TITLE_MIN_LENGTH = 1
    const TITLE_MAX_LENGTH = 64
    const CONTEXT_MIN_LENGTH = 0
    const CONTEXT_MAX_LENGTH = 512

    const ownerAccount = request.session.accountID
    const topicTitle = request.body.title
    const topicContext = request.body.context
    let formErrors = []

    if (!ownerAccount) {
        formErrors.push("You must login to create a topic.")
    }
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
            formErrors: formErrors
        }
        renderPage(request, response, args)
    } else {
        db.run("insert into topic (ownerID, title, context) values (?,?,?)",
            [ownerAccount, topicTitle, topicContext],
            (err) => {
                if (err) {
                    errorPage.internalServer(response)
                } else {
                    db.get("select topicID from topic where ownerID = ? order by age desc",
                        [ownerAccount],
                        (err, topic) => {
                            if (err || !topic) {
                                errorPage.internalServer(response)
                            } else {
                                response.redirect("/topic:" + topic.topicID)
                            }
                        }
                    )
                }
            }
        )
    }
}

module.exports = {createTopic}