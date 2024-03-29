const mainModel = require("../lib/mainModel")

function loginPage(request, response, args) {
    let model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Login"
    }
    response.render("pages/login.hbs", model)
}

module.exports = {loginPage}