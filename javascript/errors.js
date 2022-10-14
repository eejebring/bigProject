const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error."

function internalServer(response) {
    response.status(500);
    response.send(INTERNAL_SERVER_ERROR_MESSAGE);
}

module.exports = {internalServer}