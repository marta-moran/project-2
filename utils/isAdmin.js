const { ADMIN } = require("../const/index");
function isAdmin(req) {
    return req.session.currentUser.role === ADMIN;
}

module.exports = isAdmin;