const { Schema, model } = require("mongoose");
const { ROLES, USER } = require("../const/index");

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },
    avatar: {
      type: String, default: 'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    role: { type: String, enum: ROLES, default: USER },
    series: [{ type: Schema.Types.ObjectId, ref: "series" }],
    points: { type: Number, default: 0 },
    description: { type: String, default: "Soy muy creativo y no tengo bio" }
  },
  {

    timestamps: true,
    versionKey: false
  }
);

const User = model("users", userSchema);

module.exports = User;
