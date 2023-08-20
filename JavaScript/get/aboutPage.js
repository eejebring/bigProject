const mainModel = require("../lib/mainModel")

function aboutPage(request, response, args) {

    const model = {
        ...args,
        ...mainModel(request),
        pageTitle: "About"
    }
    response.render("pages/about.hbs", model)
}

module.exports = {aboutPage}