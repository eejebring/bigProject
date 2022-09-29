const express = require('express');
const expressHandlebars = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');
const bcrypt = require('bcryptjs');
const app = express();

app.engine("hbs", expressHandlebars.engine({
    defaultLayout: "index.hbs"
}));

app.use(
    express.static("public"),
    express.urlencoded({extended:false})
    );

app.get("/", function(request, response){
    db.all("select * from humans", function (error, humans) {
        if (error) {
            console.log(error.message);
        }
        else {
            const model = {
                humans:humans,
                pageTitle: "Home"
            };
            response.render("pages/showAllHumans.hbs", model);
        };
    });
});

app.get("/about", function(request, response) {
    const model = {pageTitle: "About"};
    response.render("pages/about.hbs",model);
});

app.get("/login", function (request, response) {
    const model = {pageTitle: "Login"};
   response.render("pages/login.hbs", model)
});

app.get("/createAccount", function (request, response) {
    response.render("pages/createAccount.hbs")
});

app.post("/createAccount", function (request, response){
    console.log(request.body.username);
    response.redirect("/");
});

/*db.run("create table webpages (" +
    "pageID int identity primary key," +
    "name varchar(255)," +
    "title varchar(255)," +
    "layout int not null)",
    function (error) {
    if (error) {
        console.log(error.message);
    }
});*/

app.listen(8080);
