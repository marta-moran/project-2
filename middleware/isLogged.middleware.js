const isLogged = (app) => (req, res, next) => {
    if (!req.session.currentUser) {
        res.render('auth/login', { errorMessage: "Logeate maki" })
    }
    next()
}

module.exports = isLogged