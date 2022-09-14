const router = require("express").Router();
const SeriesModel = require("../models/Serie.model");
const { ADMIN, USER } = require("../const/index");
const roleValidation = require("../middleware/roles.middleware");
const multerMiddleware = require('../middleware/multer.middleware');
const axiosSeries = require("../connect/axios.connect");
const axiosSerie = new axiosSeries();
const slugger = require("../utils/slugTransform");
const User = require('../models/User.model')


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

router.get("/:id/edit", roleValidation(ADMIN), (req, res, next) => {

    SeriesModel.findById(req.params.id)

        .then((serie) => {
            res.render("series/serie-update", serie);
        })
        .catch((err) => {
            console.log(err)
        })
})


router.get("/:id/translate", (req, res, next) => {

    SeriesModel.findById(req.params.id)
        .then((serie) => {
            axiosSerie
                .getQuote(serie.slug)
                .then((phrase) => {

                    res.render("series/serie-translate", phrase)
                })

        })

        .catch((err) => console.log(err));
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

            res.redirect(`/series/${req.params.id}`)

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
            // console.log(serie);
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
    const { title, existingImage } = req.body;
    const slugTrans = slugger(title);
    let image = ''

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }

    SeriesModel.create({ title, slug: slugTrans, image: image })
        .then(() => {
            res.redirect("/series");
        })
        .catch((err) => next(err));
})


router.post("/:id/edit", multerMiddleware.single('image'), (req, res, next) => {
    const { title, existingImage } = req.body
    let image = ''

    if (req.file && req.file.path) {
        image = req.file.path;
    } else {
        image = existingImage;
    }

    SeriesModel.findByIdAndUpdate(req.params.id, { title, image: image }, { new: true })
        .then((serieUpdate) => {
            res.redirect("/series")
        })
        .catch((err) => next(err));
})



module.exports = router;