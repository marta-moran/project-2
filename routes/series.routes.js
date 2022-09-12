const router = require("express").Router();
const SeriesModel = require("../models/Serie.model")

router.get("/", (req, res, next) => {

    SeriesModel.find()
        .then((series) => {
            console.log(series)
            res.render("series/series-list", { series })
        })
        .catch((err) => {
            console.log(err);
        })
})


router.get("/create", (req, res, next) => {
    res.render("series/serie-create");
})

router.get("/:id/edit", (req, res, next) => {
    SeriesModel.findById(req.params.id)
        .then((serie) => {
            res.render("series/serie-update", serie);
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get("/:id", (req, res, next) => {

    SeriesModel.findById(req.params.id)
        .then((serie) => {
            console.log(serie);
            res.render("series/serie-watch", serie)
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

router.get("/:id/delete", (req, res, next) => {

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
    SeriesModel.findByIdAndUpdate(req.params.id, title)
        .then((serie) => {
            res.redirect("/series", serie)
        })
        .catch((err) => next(err));
})








module.exports = router;