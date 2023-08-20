const errorPage = require("../lib/errors")
const {accountPage} = require("../get/accountPage")
const db = require("../lib/db")

function updateNickname(request, response) {
    const NICKNAME_MIN_LENGTH = 5
    const NICKNAME_MAX_LENGTH = 25

    let newNickname = request.body.nickname
    db.get(
        "select nickname from account where nickname = ?",
        [request.body.nickname],
        (err, usedNickname) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                let nicknameFormErrors = []

                if (usedNickname != undefined) {
                    nicknameFormErrors.push("Nickname already taken.")
                }
                if (newNickname.length < NICKNAME_MIN_LENGTH) {
                    nicknameFormErrors.push("Nickname must be at least " + NICKNAME_MIN_LENGTH + " characters long")
                }
                if (NICKNAME_MAX_LENGTH <= newNickname.length) {
                    nicknameFormErrors.push("Nickname must be at most " + NICKNAME_MAX_LENGTH + " characters long")
                }

                if (nicknameFormErrors.length) {
                    accountPage(request, response, {nicknameFormErrors: nicknameFormErrors})
                } else {
                    db.run(
                        "update account\n" +
                        "set nickname = ?\n" +
                        "where accountID = ?",
                        [newNickname, request.session.accountID],
                        (err) => {
                            if (err) {
                                errorPage.internalServer(response)
                            } else {
                                let args = {
                                    success: "Successfully changed nickname!"
                                }
                                accountPage(request, response, args)
                            }
                        }
                    )
                }
            }
        }
    )
}

module.exports = {updateNickname}