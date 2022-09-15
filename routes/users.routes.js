const router = require("express").Router();
const User = require('../models/User.model')
const { ADMIN, USER } = require('../const/index');
const multerMiddleware = require('../middleware/multer.middleware');
const SerieModel = require('../models/Serie.model')
const userAdmin = require("../utils/isAdmin")

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
            if (userAdmin(req)) {
                isAdmin = true
            } else if (req.session.currentUser._id.toString() === req.params.id.toString()) {
                canEdit = true
            }
            console.log(user)
            res.render('users/view-user', { user, isAdmin, canEdit })
        })
        .catch((err) => {
            next(err);
        });
})


router.get('/:id/edit', (req, res, next) => {

    console.log("GET username--->", req.app.locals.currentUsername)

    if (userAdmin(req) || req.session.currentUser._id.toString() === req.params.id.toString()) {
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

router.get('/:id/delete', async (req, res, next) => {
    try {
        // crear variable ID del params
        const userId = req.params.id;
        if (req.session.currentUser._id.toString() === userId.toString() || userAdmin(req)) {
            // const seriesUsers = await SerieModel.find().select('users')
            console.log(seriesUsers)

            await SerieModel.findOneAndUpdate({ users: { $in: [req.params.id] } }, { $pull: { users: req.params.id } })

            // for (let serieUsers of seriesUsers) {
            //     console.log(serieUsers)
            //     if (serieUsers.users.includes(userId)) {
            //         const index = serieUsers.users.indexOf(userId)
            //         const newUsers = serieUsers.users.splice(index, 1)
            //         const serie = await SerieModel.findByIdAndUpdate(serieUsers._id, { users: serieUsers.users })
            //         console.log(serie, { new: true })
            //     }
            // }
            const deletedUser = await User.findByIdAndDelete(userId)
            // eliminar sesión 
            if (req.session.currentUser.role != ADMIN) {
                res.redirect('/logout')
            } else {
                res.redirect('/users')
            }
        } else {
            console.log(req.session.currentUser._id.toString() !== userId.toString())
            console.log(req.session.currentUser.role !== ADMIN)
            console.log('No puedes hacer esto')
            res.redirect('/login')

        }
    } catch (err) {
        next(err)
    }
})

router.post('/:id/edit', multerMiddleware.single('image'), (req, res, next) => {
    const { username, existingImage, description } = req.body;
    console.log(req.body)
    let image = '';

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }
    console.log("Image-->", image)
    User.findByIdAndUpdate(req.params.id, { username, avatar: image, description }, { new: true })
        .then((userUpdate) => {

            req.session.currentUser = userUpdate
            req.app.locals.currentAvatar = req.session.currentUser.avatar
            req.app.locals.currentUsername = req.session.currentUser.username
            res.redirect(`/users/${req.params.id}`)
        })
        .catch((err) => {
            console.log("Message--->", err.message)
            if (err.code === 11000) {
                res.render('users/edit-form', { errorMessage: 'Username already in use' })

            } else if (err.message === 'Image file format webp not allowed') {
                res.render('users/edit-form', { errorMessage: 'Image format invalid' })

            } else {
                next(err);
            }
        });
})

router.post('/:id/points', (req, res, next) => {

    User.findByIdAndUpdate(req.params.id, { $inc: { points: req.body.points } }, { new: true })
        .then((updatedUser) => {
            req.session.currentUser = updatedUser
            res.sendStatus(200)
        })

        .catch((err) => console.log(err))

})




module.exports = router;