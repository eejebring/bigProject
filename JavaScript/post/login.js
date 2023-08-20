const errorPage = require("../lib/errors")
const bcrypt = require("bcryptjs")
const db = require("../lib/db")
const {loginPage} = require("../get/loginPage")

function login(request, response, username = request.body.username, loginPassword = request.body.password) {
    db.get("select accountID, password, roleID from account where username = ?",
        [username],
        (err, accountDetails) => {
            if (err) {
                errorPage.internalServer(response)
            } else if (accountDetails == undefined) {
                const args = {
                    loginFailure: true,
                    attemptedUsername: username
                }
                response.render("pages/login.hbs", args)
            } else {
                bcrypt.compare(loginPassword, accountDetails.password, (err, result) => {
                    if (err) {
                        errorPage.internalServer(response)
                    } else if (result) {
                        request.session.accountID = accountDetails.accountID
                        request.session.roleID = accountDetails.roleID
                        response.redirect("/account")
                    } else {
                        const args = {
                            loginFailure: true,
                            attemptedUsername: username
                        }
                        loginPage(request, response, args)
                    }
                })
            }
        })
}

module.exports = {login}