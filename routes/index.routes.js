const router = require("express").Router();
const UserModel = require('../models/User.model')
// const bcrypt = require('bcryptjs');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login")
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  console.log({ username, password })
})

module.exports = router;
