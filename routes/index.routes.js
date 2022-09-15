const router = require("express").Router();
const bcrypt = require('bcryptjs');
const multerMiddleware = require('../middleware/multer.middleware');
const User = require('../models/User.model')
const SeriesModel = require("../models/Serie.model")
const hasNumber = require('../utils/hasNumber')
const saltRounds = 10

/* GET home page */
router.get("/", (req, res, next) => {

  res.render("index")
  // SeriesModel.find()
  //   .then((serieFollow) => {

  //     serieFollow.sort(function (a, b) {
  //       return b.users.length - a.users.length;
  //     })
  //     console.log(serieFollow)
  //     const orderSeries = serieFollow.slice(0, 3);
  //     // res.json(orderSeries);
  //     res.render("index", { orderSeries });

  //     // res.json(orderSeries);
  //   })
  //   .catch((err) => console.log(err))
});

// Sign up
router.get("/signup", (req, res, next) => {
  res.render('auth/signup')
})

router.get("/login", (req, res, next) => {
  res.render("auth/login") //rebderizar a una página distinta concreta para el user
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => res.redirect('/login'))
})


router.post('/signup', multerMiddleware.single('avatar'), (req, res, next) => {
  let { username, userPwd, description } = req.body;
  if (description === "") {
    description = undefined
  }
  console.log(req.body.description)

  let image = undefined;
  if (req.file && req.file.path) {
    image = req.file.path
  }

  if (userPwd.length > 5 && hasNumber(userPwd)) {
    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(userPwd, salt))
      .then(hashedPassword => User.create({ username, password: hashedPassword, avatar: image, description }))
      .then((createdUser) => {
        console.log(createdUser)
        req.session.currentUser = createdUser
        res.redirect(`/users/${createdUser._id}`)
      })
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
        res.redirect('/users/main-page')
      }
    })
    .catch(error => next(error))
})

router.post('/setlanguage', (req, res, next) => {
  console.log(req.body)
  const { language } = req.body
  User.findByIdAndUpdate(req.session.currentUser._id, { language }, { new: true })
    .then((updatedUser) => {
      console.log(updatedUser)
      req.session.currentUser = updatedUser
      req.app.locals.language = updatedUser.language
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

module.exports = router;
