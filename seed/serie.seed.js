const mongoose = require("mongoose");
const SerieModel = require("../models/Serie.model");



const serie = [
    {
        title: "Serie1",
        image: "https://images.freeimages.com/images/large-previews/c10/building-1233576.jpg",


    },
    {
        title: "Serie2",
        image: "https://media.istockphoto.com/photos/manhattan-office-building-from-below-picture-id811478226?k=20&m=811478226&s=612x612&w=0&h=PnRFeJT9K1dLDE9yJe65Lr3RLyKYF_qWVOSjDkbQyvs=",


    },
    {
        title: "Serie3",
        image: "https://media.istockphoto.com/photos/manhattan-office-building-from-below-picture-id811478226?k=20&m=811478226&s=612x612&w=0&h=PnRFeJT9K1dLDE9yJe65Lr3RLyKYF_qWVOSjDkbQyvs=",


    }, {
        title: "Serie4",
        image: "https://media.istockphoto.com/photos/manhattan-office-building-from-below-picture-id811478226?k=20&m=811478226&s=612x612&w=0&h=PnRFeJT9K1dLDE9yJe65Lr3RLyKYF_qWVOSjDkbQyvs=",


    }
];

mongoose
    .connect("mongodb://localhost/project-2")

    .then(() => {
        console.log("conectado")
        return SerieModel.deleteMany();
    })
    .then(() => {
        console.log("borrado")
        return SerieModel.insertMany(serie)
    })
    .then((serie) => {
        console.log(serie)
    })
    .catch((err) => {
        console.error("Error connecting to mongo: ", err);
    })
    .finally(() => {
        mongoose.connection.close();
    });
