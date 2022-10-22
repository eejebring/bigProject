const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");

function renderPage(request, response, args) {
    const model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Create Topic"
    }
    response.render("pages/createTopic.hbs",model);
}

function createNew( request, response ) {
    const titleMinLength = 1;
    const titleMaxLength = 64;
    const contextMinLength = 0;
    const contextMaxLength = 512;

    const ownerAccount = request.session.accountID;
    const topicTitle = request.body.title;
    const topicContext = request.body.context;
    let formErrors = [];

    if (!ownerAccount) {formErrors.push("You must login to create a topic.")}
    if (topicTitle.length < titleMinLength) {formErrors.push("The title must be at least " + titleMinLength + " character long.")}
    if (titleMaxLength < topicTitle.length) {formErrors.push("The title must be at most " + titleMaxLength + " character long")}
    if (topicContext.length < contextMinLength) {formErrors.push("The title must be at least " + contextMinLength + " character long.")}
    if (contextMaxLength < topicContext.length) {formErrors.push("The title must be at most " + contextMaxLength + " character long")}

    if (formErrors.length) {
        const args = {
            formErrors:formErrors
        }
        renderPage(request, response, args)
    }
    else {
        db.run("insert into topic (ownerID, title, context) values (?,?,?)",
            [ownerAccount, topicTitle, topicContext],
            (err) => {
                if (err) {
                    errorPage.internalServer(response);
                }
                else {
                    db.get("select topicID from topic where ownerID = ? order by age desc",
                        [ownerAccount],
                        (err, topic)=> {
                            if (err || !topic) {
                                errorPage.internalServer(response);
                            }
                            else {
                                response.redirect("/topic:" + topic.topicID);
                            }
                        }
                    );
                }
            }
        );
    }
}

module.exports = {createNew, renderPage}