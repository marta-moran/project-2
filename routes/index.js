const isLogged = require('../middleware/isLogged.middleware')

module.exports = app => {
    const indexRoutes = require("./index.routes")
    app.use("/", indexRoutes)

    const usersRoutes = require("./users.routes")
    app.use("/users", usersRoutes) //aquí middleware
    const series = require('./series.routes');
    app.use('/series', series);
}
