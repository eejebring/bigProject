const mainModel = require("./layout");

function renderPage (request, response, args) {
    model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Contact"
    };
    response.render("pages/contact.hbs",model);
}

module.exports = {renderPage}