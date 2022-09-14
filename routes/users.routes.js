const router = require("express").Router();
const User = require('../models/User.model')
const { ADMIN, USER } = require('../const/index');
const multerMiddleware = require('../middleware/multer.middleware');

router.get('/', (req, res, next) => {
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
        .populate('series')
        .then((user) => {
            console.log(user)
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            } else if (req.session.currentUser._id.toString() === req.params.id.toString()) {
                canEdit = true
            }
            res.render('users/view-user', { user, isAdmin, canEdit })
        })
        .catch((err) => {
            next(err);
        });
})


router.get('/:id/edit', (req, res, next) => {

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

router.get('/:id/follow', (req, res, next) => {
    User.findByIdAndUpdate(req.session.currentUser._id,)
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

router.post('/:id/edit', multerMiddleware.single('image'), (req, res, next) => {
    const { username, existingImage } = req.body;
    console.log(username, existingImage)
    let image = '';

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }
    console.log("Image-->", image)
    User.findByIdAndUpdate(req.params.id, { username, image: image }, { new: true })
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

router.post('/:id/points', (req, res, next) => {
    console.log("Body--->", req.body.points)
    const points = req.session.currentUser.points + req.body.points

    User.findByIdAndUpdate(req.params.id, { points: points }, { new: true })
        .then((updatedUser) => {
            req.session.currentUser = updatedUser
            res.sendStatus(200)
        })

        .catch((err) => console.log(err))
    // req.app.locals.points = points
})




module.exports = router;