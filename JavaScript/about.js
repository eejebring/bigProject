const mainModel = require("./layout");

function renderPage (request, response, args) {;
    model = {
        ...args,
        ...mainModel(request),
        pageTitle: "About"
    };
    response.render("pages/about.hbs",model);
}

module.exports = {renderPage}