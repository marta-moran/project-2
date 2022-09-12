module.exports = app => {
    const indexRoutes = require("./index.routes")
    app.use("/", indexRoutes)

    const usersRoutes = require("./users.routes")
    app.use("/", usersRoutes)
    const series = require('./routes/series.routes');
    app.use('/series', series);
}
