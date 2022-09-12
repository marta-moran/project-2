const router = require("express").Router();
const multerMiddleware = require('../middleware/multer.middleware');
const User = require('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Sign up
router.get("/signup", (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', multerMiddleware.single('avatar'), (req, res, next) => {
  const { username, password } = req.body;
  let image = undefined;
  if (req.file && req.file.path) {
    image = req.file.path
  }
  User.create({ username, password, avatar: image })
    .then((user) => {
      res.redirect('/');
    })
    .catch((err) => next(err));
});


module.exports = router;
