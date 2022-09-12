const router = require("express").Router();

router.get('/users', (req, res, next) => {
    res.render('list-users')
})

module.exports = router;