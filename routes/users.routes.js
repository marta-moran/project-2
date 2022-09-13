const router = require("express").Router();
const User = require('../models/User.model')
const { ADMIN, USER } = require('../const/index');
const multerMiddleware = require('../middleware/multer.middleware');

router.get('/', (req, res, next) => {
    User.find()
    User.find()
        .then(users => {
            res.render('users/list-users', { users })
        })
        .catch(error => next(error))
})

router.get('/:id', (req, res, next) => {
    let isAdmin = false
    let canEdit = false

    User.findById(req.params.id)
        .then((user) => {
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            } else if (req.session.currentUser._id.toString() === req.params.id.toString()) {
                canEdit = true
            }
            // console.log({ user, isAdmin, canEdit })
            res.render('users/view-user', { user, isAdmin, canEdit })
        })
        .catch((err) => {
            next(err);
        });
})

router.get('/:id/edit', (req, res, next) => {
    // console.log(req.session.currentUser.role !== ADMIN)
    // console.log(req.session.currentUser._id.toString() !== req.params.id.toString())
    console.log("GET username--->", req.app.locals.currentUsername)

    if (req.session.currentUser.role === ADMIN || req.session.currentUser._id.toString() === req.params.id.toString()) {
        User.findById(req.params.id)
            .then((user) => {
                res.render('users/edit-form', user)
            })

    } else {
        res.redirect('/login')
    }

})

router.post('/:id/edit', multerMiddleware.single('avatar'), (req, res, next) => {
    const { username, existingImage } = req.body;
    console.log(username, existingImage)
    let image = '';

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }
    console.log("Image-->", image)
    User.findByIdAndUpdate(req.params.id, { username, avatar: image }, { new: true })
        .then((userUpdate) => {
            // console.log(userUpdate)
            req.session.currentUser = userUpdate
            req.app.locals.currentAvatar = req.session.currentUser.avatar
            req.app.locals.currentUsername = req.session.currentUser.username
            // console.log(req.app.locals.currentUsername)

            // console.log("redirecting...")

            res.redirect(`/users/${req.params.id}`)
        })
        .catch((err) => {
            if (err.code === 11000) {
                res.render('users/edit-form', { errorMessage: 'Username already in use' })

            } else {
                next(err);
            }
        });
})

router.get('/:id/delete', (req, res, next) => {
    if (req.session.currentUser.role !== ADMIN || req.session.currentUser._id.toString() !== req.params.id.toString()) {
        res.redirect('/login')
    }
    User.findByIdAndDelete(req.params.id)
        .then((deleteUser) => {
            console.log(deleteUser)
            res.redirect('/users')
        })
        .catch((err) => {
            next(err);
        });
})

module.exports = router;