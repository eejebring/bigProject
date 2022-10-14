const errorPage = require("./errors");
const mainModel = require("./layout");

function renderPage (request, response, args) {
    model = {
        ...args,
        pageTitle: "About"
    };
    response.render("pages/about.hbs",model);
}

module.exports = {renderPage}