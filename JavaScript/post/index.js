const {createAccount} = require("./createAccount")
const {createComment} = require("./createComment")
const {createTopic} = require("./createTopic")
const {deleteAccount} = require("./deleteAccount")
const {deleteComment} = require("./deleteComment")
const {deleteTopic} = require("./deleteTopic")
const {login} = require("./login")
const {logout} = require("./logout")
const {updateComment} = require("./updateComment")
const {updateNickname} = require("./updateNickname")
const {updatePassword} = require("./updatePassword")
const {updateTopic} = require("./updateTopic")
const {uploadImage} = require("./uploadImage")

module.exports = {
    createAccount,
    createComment,
    createTopic,
    deleteAccount,
    deleteComment,
    deleteTopic,
    login,
    logout,
    updateComment,
    updateNickname,
    updatePassword,
    updateTopic,
    uploadImage
}
