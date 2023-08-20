const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
const mainModel = require("../lib/mainModel")
const {logout} = require("./loginPage")
const {getInitials} = require("../lib/getInitials")

function accountPage(request, response, args = {}) {
    db.get(
        "select username, nickname, title  from account as A join roles as J on A.roleID = J.roleID where accountID = ?",
        [request.session.accountID],
        (err, accountDetails) => {
            if (err || accountDetails == undefined) {
                errorPage.internalServer(response)
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
        })
}

module.exports = {accountPage}