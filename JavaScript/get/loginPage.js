const bcrypt = require("bcryptjs")
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
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