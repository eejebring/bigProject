const mainModel = require("../lib/mainModel")

function createTopicPage(request, response, args) {
    const model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Create Topic"
    }
    response.render("pages/createTopic.hbs", model)
}


module.exports = {createTopicPage}