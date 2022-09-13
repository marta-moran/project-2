const router = require("express").Router();
const SeriesModel = require("../models/Serie.model");
const { ADMIN, USER } = require("../const/index");
const roleValidation = require("../middleware/roles.middleware");
const multerMiddleware = require('../middleware/multer.middleware');
const axiosSeries = require("../connect/axios.connect");
const axiosSerie = new axiosSeries();


router.get("/", (req, res, next) => {
    let isAdmin = false

    SeriesModel.find()
        .then((series) => {
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            }
            console.log(series)
            res.render("series/series-list", { series, isAdmin })
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

router.get("/:id", (req, res, next) => {

    let isAdmin = false
    console.log(req.session.currentUser.role)
    SeriesModel.findById(req.params.id)
        .then((serie) => {
            console.log(serie);
            if (req.session.currentUser.role === ADMIN) {
                isAdmin = true
            }
            res.render("series/serie-watch", { serie, isAdmin })
        })
        .catch((err) => console.log(err));
})


router.get("/:id/translate", (req, res, next) => {

    SeriesModel.findById(req.params.id)
        .then((serie) => {
            console.log(serie);
            res.render("series/serie-translate", serie)
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

// Crear y editar POST

router.post("/create", (req, res, next) => {
    const { title } = req.body;
    SeriesModel.create({ title })
        .then(() => {
            res.redirect("/series");
        })
        .catch((err) => next(err));
})


router.post("/:id/edit", multerMiddleware.single('image'), (req, res, next) => {
    const { title, existingImage } = req.body
    console.log("EEEE: " + existingImage)
    let image = ''

    if (req.file && req.file.path) {
        image = req.file.path;
        console.log("hola")
    } else {
        image = existingImage;
    }

    SeriesModel.findByIdAndUpdate(req.params.id, { title, image: image }, { new: true })
        .then((serieUpdate) => {
            console.log("SERIE NUEVA ACTUALIZADA -->" + serieUpdate)
            res.redirect("/series")
        })
        .catch((err) => next(err));
})



module.exports = router;