const express = require("express");
const expressHandlebars = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const expressSession = require("express-session")
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
const app = express();

const index = require("./javascript/index.js");
const about = require("./javascript/about.js");
const account = {
    user:require("./javascript/user.js"),
    login:require("./javascript/login.js"),
    create:require("./javascript/createAccount.js")
}

app.engine("hbs", expressHandlebars.engine({
    defaultLayout: "main.hbs"
}));

app.use(
    express.static("public"),
    express.urlencoded({extended:false}),
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: "mhwsdfpqivzz"
    })
);

app.get("/", (request, response) => index.renderPage(request, response));
app.get("/about", (request, response) => about.renderPage(request,response));
app.get("/login", (request, response) => account.login.renderPage(request, response));
app.get("/createAccount", (request, response) => account.create.renderPage(request, response));
app.get("/account", (request, response) => account.user.renderPage(request, response));

app.post("/login", (request, response) => account.login.loginRequest(request, response));
app.post("/createAccount", (request, response) => account.create.createNew(request, response));
app.post("/changeNickname", (request, response) => account.user.changeNickname(request, response));
app.post("/logout", (request, response) => account.login.logout(request, response));
app.post("/changePassword", (request, response) => account.user.changePassword(request, response));

app.listen(8080);
