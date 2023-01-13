const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
const bcrypt = require("bcryptjs");

const errorPage = require("./errors");
const mainModel = require("./layout");
const {response} = require("express");
const {logout} = require("./login");

function renderPage(request, response, args = {}) {
    db.get(
        "select username, nickname, title  from account as A join roles as J on A.roleID = J.roleID where accountID = ?",
        [request.session.accountID],
        (err, accountDetails) => {
            if (err || accountDetails == undefined) {
                errorPage.internalServer(response);
            } else {
                let model = {
                    ...args,
                    ...mainModel(request),
                    ...accountDetails,
                    pageTitle: "My Account",
                    initials: getInitials(accountDetails.username, accountDetails.nickname)
                }
                response.render("pages/user.hbs", model)
            }
        });
}

function getInitials(username, nickname) {
    const INITIALS_LENGTH = 2;

    let name;
    if (nickname) {
        name = nickname;
    }
    else {
        name = username;
    }
    return name.substring(0,INITIALS_LENGTH);
}

function changeNickname (request, response) {
    const NICKNAME_MIN_LENGTH = 5;
    const NICKNAME_MAX_LENGTH = 25;

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
                if (newNickname.length < NICKNAME_MIN_LENGTH) {nicknameFormErrors.push("Nickname must be at least " + NICKNAME_MIN_LENGTH + " characters long")}
                if (NICKNAME_MAX_LENGTH <= newNickname.length) {nicknameFormErrors.push("Nickname must be at most " + NICKNAME_MAX_LENGTH + " characters long")}

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
                        }
                    );
                }
            }
        }
    );
}

function changePassword(request, response) {
    const PASSWORD_MIN_LENGTH = 8;
    const PASSWORD_MAX_LENGTH = 60;
    const PASSWORD_SALT_ROUNDS = 12;

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

                            if (password.length < PASSWORD_MIN_LENGTH) {passwordFormErrors.push("The password must be at least " + PASSWORD_MIN_LENGTH + " characters long.")}
                            if (PASSWORD_MAX_LENGTH <= password.length) {passwordFormErrors.push("The password can at most be " + PASSWORD_MAX_LENGTH + " characters long.")}
                            if (password != request.body.reenteredPassword) {passwordFormErrors.push("The password and reentered password must be identical.")}

                            if (passwordFormErrors.length) {
                                const args = {
                                    passwordFormErrors:passwordFormErrors
                                }
                                renderPage(request, response, args)
                            }
                            else {
                                const encryptedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);
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
                            }
                            renderPage(request, response, args)
                        }
                    }
                );
            }
        }
    );
}

function uploadImage (request, response) {
    let imageFormErrors = [];

    if (!request.files) {imageFormErrors.push("No file found")}
    else {
        if (request.files.image.mimetype != "image/png") {imageFormErrors.push("Image file must be a png")}
    }

    if (!imageFormErrors.length) {
        db.get("select username from account where accountID = ?",
            [request.session.accountID],
            (err, account) => {
            if (err) {
                errorPage.internalServer(response);
            }
            else {
                let fileName = account.username + ".png";
                request.files.image.name = fileName;
                console.log(request.files.image)
                request.files.image.mv("public/userImages/" + fileName, (err) => {
                    if (err) {
                        console.log(err);
                        errorPage.internalServer(response);
                    }
                    response.redirect("/account");
                }
                );
            }
        }
        );
    }
    else {
        renderPage(request, response, {imageFormErrors});
    }
}

function deleteAccount(request, response) {
    db.run("delete from account where accountID = ?",
        [request.session.accountID],
        (err) => {
            if (err) {
                errorPage.internalServer(response);
            }
            else {
                logout(request, response);
            }
        }
    )
}

module.exports = {renderPage, changeNickname, changePassword, getInitials, uploadImage, deleteAccount}