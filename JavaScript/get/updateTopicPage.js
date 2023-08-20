const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
const mainModel = require("../lib/mainModel")

function updateTopicPage(request, response, args, topicID) {
    if (!topicID) {
        topicID = parseInt(request.params.ID)
    }

    db.get(
        "select title, context from topic where topicID = ?",
        [topicID],
        (err, topicDetails) => {
            if (err || !topicDetails) {
                errorPage.internalServer(response)
            } else {
                const model = {
                    ...args,
                    ...mainModel(request),
                    pageTitle: "Update Topic",
                    title: topicDetails.title,
                    context: topicDetails.context,
                    topicID
                }
                response.render("pages/createTopic.hbs", model)
            }
        })
}


module.exports = {updateTopicPage}