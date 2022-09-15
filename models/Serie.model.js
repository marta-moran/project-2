const { Schema, model } = require("mongoose");


const serieSchema = new Schema(
    {
        title: { type: String, unique: true },
        image: {
            type: String, default: 'https://i.vimeocdn.com/video/713203012_640x364.jpg?r=pad'
        },
        slug: { type: String },
        users: [{ type: Schema.Types.ObjectId, ref: 'users' }],
        description: { type: String, default: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, modi! Possimus enim, earum quidem, fugit similique minima beatae, eligendi non facere excepturi suscipit ea corrupti. Neque vero architecto provident sint?" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Serie = model("series", serieSchema);

module.exports = Serie;