function logout(request, response) {
    request.session.destroy()
    response.redirect("/")
}

module.exports = {logout}