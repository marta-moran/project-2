const { Schema, model } = require("mongoose");


const serieSchema = new Schema(
    {
        title: { type: String, unique: true },
        image: { type: String },
        slug: { type: String },
        users: [{ type: Schema.Types.ObjectId, ref: 'users' }],

    },
    {

        timestamps: true,
        versionKey: false
    }
);

const Serie = model("series", serieSchema);

module.exports = Serie;