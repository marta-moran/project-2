require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Session config
require('./config/session.config')(app)

const capitalized = require("./utils/capitalized");
const projectName = "project-2";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// Routes
require("./routes/index")(app)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
