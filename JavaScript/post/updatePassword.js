const errorPage = require("../lib/errors")
const bcrypt = require("bcryptjs")
const {accountPage} = require("../get/accountPage")
const db = require("../lib/db")


function updatePassword(request, response) {
    const PASSWORD_MIN_LENGTH = 8
    const PASSWORD_MAX_LENGTH = 60
    const PASSWORD_SALT_ROUNDS = 12

    db.get("select password from account where accountID = ?",
        [request.session.accountID],
        (err, oldPassword) => {
            if (err || oldPassword == null) {
                errorPage.internalServer(response)
            } else {
                bcrypt.compare(request.body.currentPassword, oldPassword.password, (err, result) => {
                        if (err) {
                            errorPage.internalServer(response)
                        } else if (result) {
                            let passwordFormErrors = []
                            let password = request.body.newPassword

                            if (password.length < PASSWORD_MIN_LENGTH) {
                                passwordFormErrors.push("The password must be at least " + PASSWORD_MIN_LENGTH + " characters long.")
                            }
                            if (PASSWORD_MAX_LENGTH <= password.length) {
                                passwordFormErrors.push("The password can at most be " + PASSWORD_MAX_LENGTH + " characters long.")
                            }
                            if (password != request.body.reenteredPassword) {
                                passwordFormErrors.push("The password and reentered password must be identical.")
                            }

                            if (passwordFormErrors.length) {
                                const args = {
                                    passwordFormErrors: passwordFormErrors
                                }
                                accountPage(request, response, args)
                            } else {
                                const encryptedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS)
                                db.run("update account set password = ? where accountID = ?",
                                    [encryptedPassword, request.session.accountID],
                                    (err) => {
                                        if (err) {
                                            errorPage.internalServer(response)
                                        } else {
                                            let args = {
                                                success: "Successfully changed password!"
                                            }
                                            accountPage(request, response, args)
                                        }
                                    })
                            }
                        } else {
                            const args = {
                                passwordFormErrors: ["Current password did not match."]
                            }
                            accountPage(request, response, args)
                        }
                    }
                )
            }
        }
    )
}

module.exports = {updatePassword}