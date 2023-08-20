function accountCreationPage(request, response, formErrors) {
    const model = {
        pageTitle: "Create Account",
        formErrors: formErrors
    }
    response.render("pages/create.hbs", model)
}

module.exports = {accountCreationPage}