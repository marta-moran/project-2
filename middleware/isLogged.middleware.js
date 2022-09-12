const isLogged = (app) => (req, res, next) => {
    if (!req.session.currentUser) {
        // res.render('auth/login', { errorMessage: "Logeate maki" })
        res.redirect('/login')
        req.app.locals.isLogged = false
    } else {
        req.app.locals.isLogged = true
        next()
    }
}

module.exports = isLogged