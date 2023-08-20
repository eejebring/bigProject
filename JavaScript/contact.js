const mainModel = require("./mainModel")

function renderPage(request, response, args) {
    model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Contact"
    }
    response.render("pages/contact.hbs", model)
}

module.exports = {renderPage}