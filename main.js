const express = require("express");
const expressHandlebars = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const expressSession = require("express-session")
const connectSqlite3 = require("connect-sqlite3");
const SQLiteStore = connectSqlite3(expressSession)
const app = express();

const index = require("./javascript/index");
const about = require("./javascript/about");
const account = {
    user:require("./javascript/user"),
    login:require("./javascript/login"),
    create:require("./javascript/createAccount")
}
const topic = {
    create:require("./javascript/createTopic"),
    read:require("./javascript/topic")
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
        secret: "mhwsdfpqivzz",
        store: new SQLiteStore({
            db:"database.db",
            table:"sessions"
        })
    })
);

app.get("/", (request, response) => index.renderPage(request, response));
app.get("/about", (request, response) => about.renderPage(request,response));
app.get("/login", (request, response) => account.login.renderPage(request, response));
app.get("/createAccount", (request, response) => account.create.renderPage(request, response));
app.get("/account", (request, response) => account.user.renderPage(request, response));
app.get("/logout", (request, response) => account.login.logout(request, response));
app.get("/createTopic", (request, response) => topic.create.renderPage(request, response));
app.get("/topic:ID", (request, response) => topic.read.renderPage(request, response));

app.post("/login", (request, response) => account.login.loginRequest(request, response));
app.post("/createAccount", (request, response) => account.create.createNew(request, response));
app.post("/changeNickname", (request, response) => account.user.changeNickname(request, response));
app.post("/changePassword", (request, response) => account.user.changePassword(request, response));
app.post("/createTopic", (request, response) => topic.create.createNew(request, response));
app.post("/deleteTopic", (request, response) => topic.read.deleteTopic(request, response));
app.post("/createComment", (request, response) => topic.read.addComment(request, response));

app.listen(8080);
