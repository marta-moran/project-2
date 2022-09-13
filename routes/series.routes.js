const router = require("express").Router();
const SeriesModel = require("../models/Serie.model");
const { ADMIN, USER } = require("../const/index");
const roleValidation = require("../middleware/roles.middleware");
const axiosSeries = require("../connect/axios.connect");
const axiosSerie = new axiosSeries();


router.get("/", (req, res, next) => {
    let isAdmin = false

    SeriesModel.find()
        .then((series) => {
            console.log(series)
            res.render("series/series-list", { series })
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


router.post("/:id/edit", (req, res, next) => {
    const { title } = req.body;
    SeriesModel.findByIdAndUpdate(req.params.id, { title })
        .then((serie) => {
            res.redirect("/series")
        })
        .catch((err) => next(err));
})


module.exports = router;