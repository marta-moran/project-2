const router = require("express").Router();
const SeriesModel = require("../models/Serie.model");
const { ADMIN } = require("../const/index");
const roleValidation = require("../middleware/roles.middleware");
const multerMiddleware = require('../middleware/multer.middleware');
const axiosSeries = require("../connect/axios.connect");
const axiosSerie = new axiosSeries();
const slugger = require("../utils/slugTransform");
const User = require('../models/User.model')
const deepl = require("deepl-node")
const userAdmin = require("../utils/isAdmin")
const translator = new deepl.Translator(process.env.API_KEY);

router.get("/", (req, res, next) => {
    let isAdmin = false

    SeriesModel.find()
        .then((series) => {
            if (userAdmin(req)) {
                isAdmin = true
            }
            const userfav = req.session.currentUser.series

            const favSeries = series.map((serie) => {
                if (userfav.includes(serie._id.toString())) {
                    serie.fav = true
                } else {
                    serie.fav = false
                }
                return serie;
            })
            res.render("series/series-list", { favSeries, isAdmin })
        })
        .catch((err) => {
            next(err);

        })
})



router.get("/create", roleValidation(ADMIN), async (req, res, next) => {
    try {
        const series = await axiosSerie.getShows()
        if (!req.query.error) {
            res.render("series/serie-create", { series });

        } else {
            res.render("series/serie-create", { series, errorMessage: req.query.error })
        }
    } catch (err) {
        if (err.code === 11000) {
            res.render("series/serie-create", { errorMessage: 'La serie ya existe' })
        } else {
            next(err)
        }
    }

})

router.get('/getphrase', (req, res, next) => {
    const words = req.app.locals.esPhrase
    const phrase = req.app.locals.enPhrase
    const id = req.app.locals.currentSerieId
    const userId = req.session.currentUser._id
    res.json({ words, phrase, id, userId })
})

router.get("/:id/edit", roleValidation(ADMIN), async (req, res, next) => {
    try {

        const serie = await SeriesModel.findById(req.params.id)
        if (!req.query.error) {
            res.render("series/serie-update", serie);
        } else {
            serie.errorMessage = req.query.error
            res.render("series/serie-update", serie);

        }
    } catch (err) {
        next(err)
    }
})


router.get("/:id/translate", async (req, res, next) => {
    try {
        req.app.locals.currentSerieId = req.params.id
        const serie = await SeriesModel.findById(req.params.id)
        console.log(serie.slug)
        const phrase = await axiosSerie.getQuote(serie.slug)
        const enPhrase = phrase.quote
        req.app.locals.enPhrase = enPhrase
        const character = phrase.role
        const show = phrase.show

        const result = await translator.translateText(enPhrase, null, req.session.currentUser.language);
        const words = result.text.split(" ")
        console.log("words ---> ", words)
        req.app.locals.esPhrase = words

        function compare(a, b) {
            return 0.5 - Math.random();
        }

        const shuffledWords = [...words].sort(compare);

        res.render("series/serie-translate", { words: shuffledWords, phrase: enPhrase, character, show })
    } catch (err) {
        next(err)
    }
})

router.get("/:id/delete", roleValidation(ADMIN), (req, res, next) => {

    User.findOneAndUpdate({ series: { $in: [req.params.id] } }, {
        $pull: { series: req.params.id }
    })
        .then(() => {
            return SeriesModel.findByIdAndDelete(req.params.id);
        })
        .then((serie) => {
            console.log(serie);
            res.redirect("/series")
        })
        .catch((err) => next(err));
})


router.get('/:id/like', (req, res, next) => {
    SeriesModel.findByIdAndUpdate(req.params.id, { $addToSet: { users: req.session.currentUser._id } }, { new: true })
        .then((serie) => {
            console.log("User joined the course")
            req.session.currentUser.series.push(serie._id)
            return User.updateOne({ _id: req.session.currentUser._id }, { $addToSet: { series: req.params.id } })
        })
        .then(() => {

            res.redirect(`/series`)

        })
        .catch((err) => next(err))
})

router.get('/:id/dislike', (req, res, next) => {
    User.findOneAndUpdate({ series: { $in: [req.params.id] } }, { $pull: { series: req.params.id } }, { new: true })
        .then((updateUser) => {
            req.session.currentUser = updateUser;
            return SeriesModel.findByIdAndUpdate(req.params.id, {
                $pull: { users: req.session.currentUser._id }
            })
        })
        .then((serie) => {
            console.log(serie);
            res.redirect("/series")
        })
        .catch((err) => next(err));
})

router.get("/:id", (req, res, next) => {
    let isAdmin = false

    SeriesModel.findById(req.params.id)
        .populate('users')
        .then((serie) => {
            console.log(serie);
            if (userAdmin(req)) {
                isAdmin = true
            }
            res.render("series/serie-watch", { serie, isAdmin })
        })
        .catch((err) => next(err));
})


router.post("/create", multerMiddleware.single('image'), roleValidation(ADMIN), (req, res, next) => {
    console.log("POSTEATE ESTE ")
    let { title, description } = req.body;
    const slugTrans = slugger(title);
    let image = undefined

    if (description === "") {
        description = undefined
    }

    if (req.file && req.file.path) {
        image = req.file.path;
    }

    SeriesModel.create({ title, slug: slugTrans, image: image, description })
        .then(() => {
            res.redirect("/series");
        })
        .catch((err) => {
            next(err)
        });

})

router.post("/:id/edit", multerMiddleware.single('image'), roleValidation(ADMIN), (req, res, next) => {
    const { title, existingImage, description } = req.body
    console.log(description)
    let image = ''

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }

    SeriesModel.findByIdAndUpdate(req.params.id, { title, image: image, description }, { new: true })
        .then((serieUpdate) => {
            res.redirect("/series")
        })
        .catch((err) => next(err));
})


module.exports = router;