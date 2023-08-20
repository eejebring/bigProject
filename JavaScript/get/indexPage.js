const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

const errorPage = require("../lib/errors")
const mainModel = require("../lib/mainModel")
const user = require("./accountPage")
const {getInitials} = require("../lib/getInitials")

const DELETED_USER_TITLE = "[Deleted account]"

function indexPage(request, response) {
    const TOPICS_PER_PAGE = 5
    const currentPageNr = parseInt(request.params.ID)

    db.get(
        "select count(topicID) as count from topic",
        (err, row) => {
            if (err) {
                errorPage.internalServer(response)
            } else {
                db.all(
                    "select topicID, title, age, username, nickname from topic left join account a on a.accountID = topic.ownerID order by age desc limit ? offset ?",
                    [TOPICS_PER_PAGE, TOPICS_PER_PAGE * (currentPageNr - 1)],
                    (error, topics) => {
                        if (error) {
                            errorPage.internalServer(response)
                        } else {
                            for (let i = 0; i < topics.length; i++) {
                                topics[i].initials = getInitials(topics[i].username, topics[i].nickname)
                                if (topics[i].username == null) {
                                    topics[i].username = DELETED_USER_TITLE
                                }
                            }
                            const latsPageNr = Math.ceil(row.count / TOPICS_PER_PAGE)
                            let pagination = []
                            pagination.push({
                                name: "Previous",
                                pageNr: currentPageNr - 1,
                                disabled: currentPageNr == 1
                            })
                            for (let i = 1; i <= latsPageNr; i++) {
                                pagination.push({
                                    name: i,
                                    pageNr: i,
                                    active: i == currentPageNr
                                })
                            }
                            pagination.push({
                                name: "next",
                                pageNr: currentPageNr + 1,
                                disabled: currentPageNr == latsPageNr
                            })

                            const model = {
                                ...mainModel(request),
                                topics: topics,
                                pageTitle: "Home",
                                pagination: pagination
                            }
                            response.render("pages/index.hbs", model)
                        }
                    })
            }
        })
}

module.exports = {indexPage, DELETED_USER_TITLE}