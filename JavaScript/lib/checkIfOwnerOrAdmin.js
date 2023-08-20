const {isOwner} = require("./checkIfOwner")

const ADMIN_ROLE_ID = 2

function isAdminOrOwner(request, ownerID) {
    return request.session.roleID == ADMIN_ROLE_ID || isOwner(request, ownerID)
}

module.exports = {isAdminOrOwner}