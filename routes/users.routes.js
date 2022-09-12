const router = require("express").Router();

router.get('/', (req, res, next) => {
    res.render('users/list-users')
})

module.exports = router;