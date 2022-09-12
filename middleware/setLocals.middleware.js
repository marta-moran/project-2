const setLocals = (req, res, next) => {
    req.app.locals.isLogged = req.session.currentUser ? true : false
    if (req.app.locals.isLogged) {
        req.app.locals.avatar = req.session.currentUser.avatar
        req.app.locals.username = req.session.currentUser.username
        req.app.locals.id = req.session.currentUser._id
    } next()
}

module.exports = setLocals