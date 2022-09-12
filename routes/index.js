module.exports = app => {
    const indexRoutes = require("./index.routes")
    app.use("/", indexRoutes)

    const series = require('./routes/series.routes');
    app.use('/series', series);
}
