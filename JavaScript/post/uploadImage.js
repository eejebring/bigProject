const errorPage = require("../lib/errors")
const {renderPage} = require("../get/accountPage")
const db = require("../lib/db")

function uploadImage(request, response) {
    let imageFormErrors = []

    if (!request.files) {
        imageFormErrors.push("No file found")
    } else {
        if (request.files.image.mimetype != "image/png") {
            imageFormErrors.push("Image file must be a png")
        }
    }

    if (!imageFormErrors.length) {
        db.get("select username from account where accountID = ?",
            [request.session.accountID],
            (err, account) => {
                if (err) {
                    errorPage.internalServer(response)
                } else {
                    let fileName = account.username + ".png"
                    request.files.image.name = fileName
                    request.files.image.mv("public/userImages/" + fileName, (err) => {
                            if (err) {
                                console.log(err)
                                errorPage.internalServer(response)
                            }
                            response.redirect("/account")
                        }
                    )
                }
            }
        )
    } else {
        renderPage(request, response, {imageFormErrors})
    }
}

module.exports = {uploadImage}