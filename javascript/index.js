const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");

function renderPage (request, response) {
    db.all("select title from thread", function (error, threads) {
        if (error) {
            errorPage.internalServer(response);
        }
        else {
            const model = {
                ...mainModel(request),
                humans:threads,
                pageTitle: "Home"
            }
            console.log(model)
            response.render("pages/index.hbs", model);
        }
    });
}

module.exports = {renderPage}