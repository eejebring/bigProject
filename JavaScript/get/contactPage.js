const mainModel = require("../lib/mainModel")

function contactPage(request, response, args) {
    model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Contact"
    }
    response.render("pages/contact.hbs", model)
}

module.exports = {contactPage}