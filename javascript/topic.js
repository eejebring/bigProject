const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");
const user = require("./user");

const COMMENT_MAX_LENGTH = 255;
const COMMENT_MIN_LENGTH = 1;

function renderPage(request, response, args, topicID) {
    if (!topicID) {
        topicID = request.params.ID.substring(1);
    }
    db.get(
        "select topicID, accountID, title, context, age, username, nickname, hasImage from topic join account a on a.accountID = topic.ownerID where topicID = ?",
        [topicID],
        (err, topicData) => {
            if (err) {
                errorPage.internalServer(response);
            }
            else if (topicData == null) {
                errorPage.badRequest(response);
            }
            else {
                db.all(
                    "select * from comment where topicID = ?",
                    [topicID],
                    (err, comments) => {
                        const model = {
                            ...args,
                            ...mainModel(request),
                            ...topicData,
                            initials:user.getInitials(topicData.username,topicData.nickname),
                            canDelete:topicData.accountID == request.session.accountID,
                            comments:comments
                        }
                        console.log(model);
                        response.render("pages/topic.hbs", model)
                    }
                )
            }
        }
    );
}

function deleteTopic(request, response) {
    const topicID = request.body.topicID;
    const requesterID = request.session.accountID;

    console.log({topicID, requesterID})
    db.run(
        "delete from topic where topicID = ? and ownerID = ?",
        [topicID, requesterID],
        (err) => {
            if (err) {
                errorPage.internalServer(response);
            }
            else {
                response.redirect("/");
            }
        }
    );
}

function addComment(request, response) {
    const topicID = request.body.topicID;
    const userID = request.session.accountID;
    const content = request.body.commentContent;

    let formErrors = [];

    if (COMMENT_MAX_LENGTH < content.length) {formErrors.push("Comments can at most be " + COMMENT_MAX_LENGTH + " characters long.")}
    if (content.length < COMMENT_MIN_LENGTH) {formErrors.push("Comments can at least be " + COMMENT_MIN_LENGTH + " characters long.")}

    console.log(formErrors)

    if (!formErrors.length) {
        db.run(
            "insert into comment (ownerID, topicID, content) VALUES (?,?,?)",
            [userID, topicID, content],
            (err)=> {
                if (err) {
                    errorPage.internalServer(response);
                }
                else {
                    response.redirect("/topic:" + topicID);
                }
            }
        )
    }
    else {
        renderPage(request, response,{formErrors}, topicID);
    }
}

function deleteComment(request, response) {
    const topicID = request.body.topicID;
    const requesterID = request.session.accountID;
    const commentID = "";

    console.log({topicID, requesterID})
    db.run(
        "delete from comment where commentID = ? and ownerID = ?",
        [topicID, requesterID],
        (err) => {
            if (err) {
                errorPage.internalServer(response);
            }
            else {
                response.redirect("/topic:ID");
            }
        }
    );
}

module.exports = {renderPage, addComment, deleteTopic, deleteComment}