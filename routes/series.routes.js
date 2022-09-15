const router = require("express").Router();
const SeriesModel = require("../models/Serie.model");
const { ADMIN, USER } = require("../const/index");
const roleValidation = require("../middleware/roles.middleware");
const multerMiddleware = require('../middleware/multer.middleware');
const axiosSeries = require("../connect/axios.connect");
const axiosSerie = new axiosSeries();
const slugger = require("../utils/slugTransform");
const User = require('../models/User.model')
const deepl = require("deepl-node")



router.get("/", (req, res, next) => {
    let isAdmin = false

    SeriesModel.find()
        .then((series) => {
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            }
            const userfav = req.session.currentUser.series
            // console.log("Userfav--->", userfav)
            const favSeries = series.map((serie) => {
                // console.log(serie)
                if (userfav.includes(serie._id.toString())) {
                    // console.log(true)
                    serie.fav = true

                } else {
                    // console.log(false)
                    serie.fav = false
                }
                // console.log("Serie--->", serie.fav)
                return serie
            })

            // console.log("FavSerie--->", favSeries)
            // console.log(favSeries[6].fav)
            res.render("series/series-list", { favSeries, isAdmin })
        })
        .catch((err) => {
            console.log(err);
        })
})


router.get("/create", roleValidation(ADMIN), (req, res, next) => {
    axiosSerie
        .getShows()
        .then((series) => {
            // res.json(series);

            res.render("series/serie-create", { series });
        })
})


router.get('/getphrase', (req, res, next) => {
    const words = req.app.locals.esPhrase
    const phrase = req.app.locals.enPhrase
    const id = req.app.locals.currentSerieId
    const userId = req.session.currentUser._id
    console.log({ words, phrase, id })

    res.json({ words, phrase, id, userId })
})

router.get("/:id/edit", roleValidation(ADMIN), (req, res, next) => {

    SeriesModel.findById(req.params.id)

        .then((serie) => {
            res.render("series/serie-update", serie);
        })
        .catch((err) => {
            console.log(err)
        })
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

        console.log(phrase)

        const translator = new deepl.Translator(process.env.API_KEY);

        const result = await translator.translateText(enPhrase, null, 'es');


        const words = result.text.split(" ")
        console.log("words ---> ", words)
        req.app.locals.esPhrase = words

        const shuffledWords = [...words].sort(compare)
        function compare(a, b) {
            return 0.5 - Math.random();
        }

        res.render("series/serie-translate", { words: shuffledWords, phrase: enPhrase, character, show })
    } catch (err) {
        next(err)
    }
})

router.get("/:id/delete", roleValidation(ADMIN), (req, res, next) => {

    SeriesModel.findByIdAndDelete(req.params.id)
        .then((serie) => {
            console.log(serie);
            res.redirect("/series")
        })
        .catch((err) => console.log(err));
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
    SeriesModel.findById(req.params.id)
        .then((serie) => {
            const index = serie.users.indexOf(req.session.currentUser._id.toString())
            // console.log(index)

            if (index !== -1) {
                const newusers = serie.users.splice(index, 1)
            }
            return SeriesModel.findByIdAndUpdate(req.params.id, serie, { new: true })
        })
        .then((updatedSerie) => {
            console.log(updatedSerie)
            const indexUser = req.session.currentUser.series.indexOf(req.params.id.toString())

            if (indexUser !== -1) {
                console.log(req.session.currentUser)
                req.session.currentUser.series.splice(indexUser, 1)
                console.log(req.session.currentUser)
            }

            return User.findByIdAndUpdate(req.session.currentUser._id, req.session.currentUser, { new: true })

        })
        .then((updatedUser) => {
            console.log(updatedUser)
            req.session.currentUser = updatedUser
            res.redirect('/series')
        })

        .catch(err => next(err))
})

router.get("/:id", (req, res, next) => {

    let isAdmin = false
    console.log(req.session.currentUser.role)
    SeriesModel.findById(req.params.id)
        .populate('users')
        .then((serie) => {
            console.log(serie);
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            }
            console.log("SERIES-->", serie)

            res.render("series/serie-watch", { serie, isAdmin })
        })
        .catch((err) => console.log(err));
})

// Crear y editar POST

router.post("/create", multerMiddleware.single('image'), (req, res, next) => {
    const { title, description } = req.body;
    const slugTrans = slugger(title);
    let image = undefined

    if (req.file && req.file.path) {
        image = req.file.path;
    }

    SeriesModel.create({ title, slug: slugTrans, image: image, description })
        .then(() => {
            res.redirect("/series");
        })
        .catch((err) => next(err));
})


router.post("/:id/edit", multerMiddleware.single('image'), (req, res, next) => {
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