const router = require("express").Router();
const bcrypt = require('bcryptjs');
const multerMiddleware = require('../middleware/multer.middleware');
const User = require('../models/User.model')
const hasNumber = require('../utils/hasNumber')
const saltRounds = 10

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Sign up
router.get("/signup", (req, res, next) => {
  res.render('auth/signup')
})

router.get("/login", (req, res, next) => {
  res.render("auth/login")
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => res.redirect('/login'))
})


router.post('/signup', multerMiddleware.single('avatar'), (req, res, next) => {
  const { username, userPwd, description } = req.body;
  console.log(req.body)

  let image = undefined;
  if (req.file && req.file.path) {
    image = req.file.path
  }

  if (userPwd.length > 5 && hasNumber(userPwd)) {
    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(userPwd, salt))
      .then(hashedPassword => User.create({ username, password: hashedPassword, avatar: image, description }))
      .then(createdUser => res.redirect('/login'))
      .catch(error => {
        console.log(error)
        if (error.code === 11000) {
          // console.log('User validation failed')
          res.render('auth/signup', { errorMessage: 'El usuario ya existe' })
        } else {
          next(error)
        }
      })
  } else {
    res.render('auth/signup', { errorMessage: 'La contraseña debe tener minimo 6 caracteres y contener un numero ' })
  }
});

router.post('/login', (req, res, next) => {
  const { username, userPwd } = req.body;
  console.log({ username, userPwd })
  console.log(req.session)
  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Usuario no registrado' })
        return
      } else if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render('auth/login', { errorMessage: 'La contraseña es incorrecta' })
        return
      } else {
        req.session.currentUser = user
        res.redirect('/')
      }
    })
    .catch(error => next(error))
})

module.exports = router;
