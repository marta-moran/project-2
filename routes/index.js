const isLogged = require('../middleware/isLogged.middleware')
const setLocals = require('../middleware/setLocals.middleware')


module.exports = app => {
    app.use(setLocals)

    const indexRoutes = require("./index.routes")
    app.use("/", indexRoutes)

    const usersRoutes = require("./users.routes")
    app.use("/users", isLogged(app), usersRoutes)

    const series = require('./series.routes');
    app.use('/series', isLogged(app), series);
}
