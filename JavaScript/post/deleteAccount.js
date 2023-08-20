const errorPage = require("../lib/errors")
const {logout} = require("../get/loginPage")
const db = require("../lib/db")


function deleteAccount(request, response) {
    db.run("delete from account where accountID = ?",
        [request.session.accountID],
        (err) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                logout(request, response)
            }
        }
    )
}

module.exports = {deleteAccount}