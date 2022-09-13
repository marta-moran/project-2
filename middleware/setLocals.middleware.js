const setLocals = (req, res, next) => {
    req.app.locals.isLogged = req.session.currentUser ? true : false
    if (req.app.locals.isLogged) {
        req.app.locals.currentAvatar = req.session.currentUser.avatar
        req.app.locals.currentUsername = req.session.currentUser.username
        req.app.locals.id = req.session.currentUser._id
    } next()
}

module.exports = setLocals