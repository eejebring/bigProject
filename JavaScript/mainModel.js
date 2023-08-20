function mainModel(request) {
    if (!request.session) {
        return {}
    } else {
        return {
            role: request.session.roleID
        }
    }
}

module.exports = mainModel