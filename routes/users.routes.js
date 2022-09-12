const router = require("express").Router();
const User = require('../models/User.model')

router.get('/', (req, res, next) => {
    User.find()
    User.find()
        .then(users => {
            res.render('users/list-users', { users })
        })
        .catch(error => next(error))
})

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('users/view-user', user)
        })
        .catch((err) => {
            next(err);
        });
})

router.get('/:id/edit', (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render('users/edit-form', user)
        })
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