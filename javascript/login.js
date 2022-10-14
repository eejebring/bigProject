const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");
const user = require("./user");
const index = require("./index");

function renderPage(request, response, args) {
    let model = {
        ...args,
        ...mainModel(request),
        pageTitle: "Login"
    }
    response.render("pages/login.hbs",model);
}
function loginRequest(request, response, username = request.body.username, loginPassword = request.body.password) {
    db.get("select accountID, password, roleID from account where username = ?",
        [username],
        (err, accountDetails) => {
            if (err) {
                errorPage.internalServer(response);
            } else if (accountDetails == undefined) {
                const args = {
                    loginFailure: true,
                    attemptedUsername: username
                };
                response.render("pages/login.hbs", args);
            } else {
                bcrypt.compare(loginPassword, accountDetails.password, (err, result) => {
                    if (err) {
                        errorPage.internalServer(response);
                    } else if (result) {
                        request.session.accountID = accountDetails.accountID;
                        request.session.roleID = accountDetails.roleID;
                        user.renderPage(request, response);
                    } else {
                        const args = {
                            loginFailure: true,
                            attemptedUsername: username
                        };
                        renderPage(request, response, args);
                    }
                });
            }
        })
}

function logout(request, response) {
    request.session.destroy();
    index.renderPage(request, response);
}

module.exports = {loginRequest, renderPage, logout}