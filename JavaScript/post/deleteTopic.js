const errorPage = require("../lib/errors")
const db = require("../lib/db")

function deleteTopic(request, response) {
    const topicID = request.body.topicID
    const requesterID = request.session.accountID

    db.run(
        "delete from topic where topicID = ? and ownerID = ?",
        [topicID, requesterID],
        (err) => {
            if (err) {
                errorPage.internalServer(response)

            } else {
                response.redirect("/")
            }
        }
    )
}

module.exports = {deleteTopic}