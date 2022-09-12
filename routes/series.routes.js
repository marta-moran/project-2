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

router.get("/:id", (req, res, next) => {

    SeriesModel.findById(req.params.id)
        .then((serie) => {
            console.log(serie);
            res.render("series/serie-watch", serie)
        })
        .catch((err) => console.log(err));
})

// Pendiente de revisión
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
            res.redirect("/series", serie)
        })
        .catch((err) => console.log(err));
})

// Pendiente crear y editar POST






module.exports = router;