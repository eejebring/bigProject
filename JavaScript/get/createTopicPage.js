const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
const mainModel = require("../lib/mainModel")

function createTopic(request, response, args) {
    const model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Create Topic"
    }
    response.render("pages/createTopic.hbs", model)
}


module.exports = {createTopic}