const router = require("express").Router();
const User = require('../models/User.model')
const { ADMIN, USER } = require('../const/index');

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
            console.log({ user, isAdmin, canEdit })
            res.render('users/view-user', { user, isAdmin, canEdit })
        })
        .catch((err) => {
            next(err);
        });
})

router.get('/:id/edit', (req, res, next) => {
    console.log(req.session.currentUser.role !== ADMIN)
    console.log(req.session.currentUser._id.toString() !== req.params.id.toString())

    if (req.session.currentUser.role === ADMIN || req.session.currentUser._id.toString() === req.params.id.toString()) {
        User.findById(req.params.id)
            .then((user) => {
                res.render('users/edit-form', user)
            })

    } else {

        console.log("hola")
        res.redirect('/login')
    }

})

router.post('/:id/edit', (req, res, next) => {
    const { username } = req.body
    User.findByIdAndUpdate(req.params.id, { username })
        .then((userUpdate) => {
            console.log(userUpdate)
            res.redirect('/users')
        })
        .catch((err) => {
            next(err);
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