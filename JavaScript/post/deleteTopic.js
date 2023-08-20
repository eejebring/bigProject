const errorPage = require("../lib/errors")
const db = require("../lib/db")
const {isAdminOrOwner} = require("../lib/checkIfOwnerOrAdmin")

function deleteTopic(request, response) {
    const topicID = request.body.topicID

    db.run(
        "select ownerID from topic where topicID = ?"
            [topicID],
        (err, topicDetails) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                if (!isAdminOrOwner(request, topicDetails.ownerID)) {
                    errorPage.unauthorized(response)
                } else {
                    db.run(
                        "delete from topic where topicID = ?",
                        [topicID],
                        (err) => {
                            if (err) {
                                errorPage.internalServer(response)
                            } else {
                                response.redirect("/")
                            }
                        }
                    )
                }
            }
        }
    )
}

module.exports = {deleteTopic}