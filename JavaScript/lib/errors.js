const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error."
const BAD_REQUEST_ERROR_MESSAGE = "Bad request."

function internalServer(response) {
    response.status(500)
    response.render("pages/error.hbs", {errorMessage: INTERNAL_SERVER_ERROR_MESSAGE})
}

function badRequest(response) {
    response.status(400)
    response.render("pages/error.hbs", {errorMessage: BAD_REQUEST_ERROR_MESSAGE})
}

module.exports = {internalServer, badRequest}