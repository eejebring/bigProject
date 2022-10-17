const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

const errorPage = require("./errors");
const mainModel = require("./layout");
const bcrypt = require("bcryptjs");

function renderPage(request, response, args = {}) {
    db.get(
        "select username, nickname, hasImage, title  from account as A " +
        "join roles as J on A.roleID = J.roleID " +
        "where accountID = ?",
        [request.session.accountID],
        (err, accountDetails) => {
            if (err || accountDetails == undefined) {
                errorPage.internalServer(response);
            } else {
                let model = {
                    ...args,
                    ...mainModel(request),
                    pageTitle: "My Account",
                    username: accountDetails.username,
                    nickname: accountDetails.nickname,
                    userTitle: accountDetails.title,
                    hasPicture: accountDetails.hasPicture
                }
                console.log(model);
                response.render("pages/user.hbs", model)
            }
        });
}

function getInitials(username, nickname) {
    let name;
    if (nickname) {
        name = nickname;
    }
    else {
        name = username;
    }
    return name.substring(0,2);
}

function changeNickname (request, response) {
    let newNickname = request.body.nickname;
    db.get(
        "select nickname from account where nickname = ?",
        [request.body.nickname],
        (err, usedNickname) => {
            if (err) {
                errorPage.internalServer(response);
            } else {
                let nicknameFormErrors = [];

                if (usedNickname != undefined) {nicknameFormErrors.push("Nickname already taken.")}
                if (newNickname.length < 5) {nicknameFormErrors.push("Nickname must be at least 5 characters long")}
                if (25 <= newNickname.length) {nicknameFormErrors.push("Nickname must be at most 25 characters long")}

                if (nicknameFormErrors.length) {
                    renderPage(request, response, {nicknameFormErrors: nicknameFormErrors})
                } else {
                    db.run(
                        "update account\n" +
                        "set nickname = ?\n" +
                        "where accountID = ?",
                        [newNickname, request.session.accountID],
                        (err) => {
                            if (err) {
                                errorPage.internalServer(response);
                            } else {
                                let args = {
                                    success:"Successfully changed nickname!"
                                }
                                renderPage(request, response, args);
                            }
                        });
                }
            }
        });
}

function changePassword(request, response) {
    db.get("select password from account where accountID = ?",
        [request.session.accountID],
        (err, oldPassword) => {
            if (err || oldPassword == null) {
                errorPage.internalServer(response);
            }
            else {
                bcrypt.compare(request.body.currentPassword, oldPassword.password, (err, result) => {
                    if (err) {
                        errorPage.internalServer(response);
                    } else if (result) {
                        let passwordFormErrors = [];
                        let password = request.body.newPassword;

                        if (password.length < 8) {passwordFormErrors.push("The password must be at least 8 characters long.")}
                        if (60 <= password.length) {passwordFormErrors.push("The password can at most be 60 characters long.")}
                        if (password != request.body.reenteredPassword) {passwordFormErrors.push("The password and reentered password must be identical.")}

                        if (passwordFormErrors.length) {
                            const args = {
                                passwordFormErrors:passwordFormErrors
                            };
                            renderPage(request, response, args)
                        }
                        else {
                            const encryptedPassword = bcrypt.hashSync(password, 12);
                            db.run("update account set password = ? where accountID = ?",
                                [encryptedPassword, request.session.accountID],
                                (err) => {
                                    if (err) {
                                        errorPage.internalServer(response);
                                    }
                                    else {
                                        let args = {
                                            success:"Successfully changed password!"
                                        }
                                        renderPage(request, response, args);
                                    }
                                });
                        }
                    } else {
                        const args = {
                            passwordFormErrors:["Current password did not match."]
                        };
                        renderPage(request, response, args)
                    }
                });
            }
        });
}

module.exports = {renderPage, changeNickname, changePassword, getInitials}