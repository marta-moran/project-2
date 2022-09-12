const { Schema, model } = require("mongoose");


const serieSchema = new Schema(
    {
        title: {
            type: { type: String }, unique: true
        },
        image: { type: String },
        users: { type: Schema.Types.ObjectId, ref: 'Users' },

    },
    {

        timestamps: true,
        versionKey: false
    }
);

const Serie = model("series", serieSchema);

module.exports = Serie;