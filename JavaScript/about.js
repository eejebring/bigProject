const mainModel = require("./layout")

function renderPage(request, response, args) {

    const model = {
        ...args,
        ...mainModel(request),
        pageTitle: "About"
    }
    response.render("pages/about.hbs", model)
}

module.exports = {renderPage}