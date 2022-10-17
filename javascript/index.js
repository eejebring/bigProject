const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");

function renderPage (request, response) {
    db.all("select topicID, title from topic", (error, topics) => {
        if (error) {
            errorPage.internalServer(response);
        }
        else {
            const model = {
                ...mainModel(request),
                topics:topics,
                pageTitle: "Home"
            }
            response.render("pages/index.hbs", model);
        }
    });
}

module.exports = {renderPage}