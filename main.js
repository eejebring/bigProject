const express = require("express")
const expressHandlebars = require("express-handlebars")
const expressSession = require("express-session")
const connectSqlite3 = require("connect-sqlite3")
const SQLiteStore = connectSqlite3(expressSession)
const expressFileUpload = require("express-fileupload")
const app = express()
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")
const fs = require("fs")

const getPage = require("./JavaScript/get")
const postRequest = require("./JavaScript/post")
const {request, response} = require("express")

fs.readFile("./dbSetup.sql", "utf8", (err, dbSetup) => {
    if (err) {
        console.error(err)
    } else {
        db.run(dbSetup, (err) => {
            if (err) {
                console.error(err)
            }
        })
    }
})

app.engine("hbs", expressHandlebars.engine({
    defaultLayout: "main.hbs"
}))

app.use(
    express.static("public"),
    express.urlencoded({extended: false}),
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: "mhwsdfpqivzz",
        store: new SQLiteStore({
            db: "database.db",
            table: "sessions"
        })
    }),
    expressFileUpload({
        limits: {fileSize: 50 * 1024 * 1024}
    })
)

app.get("/", (request, response) => response.redirect("/index/1"))
app.get("/index/:ID", (request, response) => getPage.indexPage(request, response))
app.get("/about", (request, response) => getPage.aboutPage(request, response))
app.get("/contact", (request, response) => getPage.contactPage(request, response))
app.get("/login", (request, response) => getPage.loginPage(request, response))
app.get("/createAccount", (request, response) => getPage.accountCreationPage(request, response))
app.get("/account", (request, response) => getPage.accountPage(request, response))
app.get("/logout", (request, response) => postRequest.logout(request, response))
app.get("/createTopic", (request, response) => getPage.createTopicPage(request, response))
app.get("/topic/:ID", (request, response) => getPage.topicPage(request, response))
app.get("/updateTopic/:ID", (request, response) => getPage.updateTopicPage(request, response))
app.get("/updateComment/:ID", (request, response) => getPage.updateCommentPage(request, response))

app.post("/login", (request, response) => postRequest.login(request, response))
app.post("/createAccount", (request, response) => postRequest.createAccount(request, response))
app.post("/updateNickname", (request, response) => postRequest.updateNickname(request, response))
app.post("/changePassword", (request, response) => postRequest.updatePassword(request, response))
app.post("/deleteAccount", (request, response) => postRequest.deleteAccount(request, response))
app.post("/createTopic", (request, response) => postRequest.createTopic(request, response))
app.post("/deleteTopic", (request, response) => postRequest.deleteTopic(request, response))
app.post("/createComment", (request, response) => postRequest.createComment(request, response))
app.post("/deleteComment", (request, response) => postRequest.deleteComment(request, response))
app.post("/uploadImage", (request, response) => postRequest.uploadImage(request, response))
app.post("/updateTopic/updateTopic", (request, response) => postRequest.updateTopic(request, response))
app.post("/updateComment", (request, response) => postRequest.updateComment(request, response))

app.listen(8080)
