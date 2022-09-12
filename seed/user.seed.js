const mongoose = require("mongoose");
const UserModel = require("../models/User.model");

const users = [
    {
        username: "marta",
        password: "hola"
    },
    {
        username: "marta123",
        password: "hola1"
    },
    {
        username: "martaaaa",
        password: "adios"
    }
]

mongoose
    .connect("mongodb://localhost/project-2")
    .then(() => {
        return UserModel.deleteMany()
    })
    .then(() => {
        return UserModel.insertMany(users)
    })
    .catch((err) => {
        console.error("Error connecting to mongo: ", err);
    })
    .finally(() => {
        mongoose.connection.close();
    });