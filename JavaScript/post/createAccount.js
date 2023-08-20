const bcrypt = require("bcryptjs")
const sqlite3 = require("sqlite3")
const db = require("../lib/db")

const errorPage = require("../lib/errors")
const {login} = require("./login")
const {renderPage} = require("../get/accountCreationPage")

function createNew(request, response) {
    const USERNAME_MIN_LENGTH = 5
    const USERNAME_MAX_LENGTH = 20
    const PASSWORD_MIN_LENGTH = 8
    const PASSWORD_MAX_LENGTH = 60
    const PASSWORD_SALT_ROUNDS = 12

    const username = request.body.newUsername
    const password = request.body.newPassword

    db.get("select username from account where username = ?",
        [username],
        (err, usedUsername) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                let formErrors = []

                if (usedUsername != undefined) {
                    formErrors.push("Username already taken.")
                }
                if (username.length < USERNAME_MIN_LENGTH) {
                    formErrors.push("The username must be at least " + USERNAME_MIN_LENGTH + " characters long.")
                }
                if (USERNAME_MAX_LENGTH < username.length) {
                    formErrors.push("The username can at most be " + USERNAME_MAX_LENGTH + " characters long.")
                }
                if (password.length < PASSWORD_MIN_LENGTH) {
                    formErrors.push("The password must be at least " + PASSWORD_MIN_LENGTH + " characters long.")
                }
                if (PASSWORD_MAX_LENGTH <= password.length) {
                    formErrors.push("The password can at most be " + PASSWORD_MAX_LENGTH + " characters long.")
                }
                if (password != request.body.reenteredPassword) {
                    formErrors.push("The password and reentered password must be identical.")
                }


                if (formErrors.length == 0) {
                    const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS)

                    db.run(
                        "insert into account (username, password) values (?,?);",
                        [username, hashedPassword],
                        (err) => {
                            if (err) {
                                errorPage.internalServer(response)
                            } else {
                                login(request, response, username, password)
                            }
                        })

                } else {
                    renderPage(request, response, {formErrors})
                }
            }
        })
}

module.exports = {createNew}