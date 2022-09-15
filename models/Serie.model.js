const { Schema, model } = require("mongoose");


const serieSchema = new Schema(
    {
        title: { type: String, unique: true },
        image: {
            type: String, default: 'https://i.vimeocdn.com/video/713203012_640x364.jpg?r=pad'
        },
        slug: { type: String },
        users: [{ type: Schema.Types.ObjectId, ref: 'users' }],
        description: { type: String, default: "Este tio no se ha visto la serie" }

    },
    {

        timestamps: true,
        versionKey: false
    }
);

const Serie = model("series", serieSchema);

module.exports = Serie;