function getInitials(username, nickname) {
    const INITIALS_LENGTH = 2

    let name
    if (nickname) {
        name = nickname
    } else if (username) {
        name = username
    } else {
        name = "NA"
    }
    return name.substring(0, INITIALS_LENGTH)
}

module.exports = {getInitials}