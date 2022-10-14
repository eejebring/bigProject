const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");
const login = require("./login")

function renderPage(request, response, formErrors) {
    const model = {
        pageTitle: "Create Account",
        formErrors: formErrors
    }
    response.render("pages/create.hbs", model)
}

function createNew (request, response) {
    const username = request.body.username;
    const password = request.body.newPassword;
    db.get("select username from account where username = ?",
        [username],
        (err, usedUsername) => {
            if (err) {
                errorPage.internalServer(response);
            } else {
                let formErrors = [];

                if (usedUsername != undefined) {formErrors.push("Username already taken.");}
                if (username.length < 5) {formErrors.push("The username must be at least 5 characters long.")}
                if (20 <= username.length) {formErrors.push("The username can at most be 20 characters long.")}
                if (password.length < 8) {formErrors.push("The password must be at least 8 characters long.")}
                if (60 <= password.length) {formErrors.push("The password can at most be 60 characters long.")}
                if (password != request.body.reenteredPassword) {formErrors.push("The password and reentered password must be identical.")}


                if (formErrors.length == 0) {
                    const encryptedPassword = bcrypt.hashSync(password, 12);

                    db.run(
                        "insert into account (username, password) values (?,?);",
                        [username,encryptedPassword],
                        (err) => {
                            if (err) {
                                errorPage.internalServer(response);
                            } else {
                                login.loginRequest(request, response, username, password);
                            }
                        })

                }
                else {
                    renderPage(request, response, {formErrors})
                }
            }
        });
}

module.exports = {renderPage, createNew};