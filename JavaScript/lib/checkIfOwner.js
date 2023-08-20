function isOwner(request, ownerID) {
    return ownerID && ownerID == request.session.accountID
}

module.exports = {isOwner}