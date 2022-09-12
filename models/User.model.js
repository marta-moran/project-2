const { Schema, model } = require("mongoose");
const { ROLES, USER } = require("../const/index");

const userSchema = new Schema(
  {
    username: {
      type: String, unique: true
    },
    password: { type: String },
    avatar: { type: String },
    friends: { type: Schema.Types.ObjectId, ref: 'users' },
    role: { type: String, enum: ROLES, default: USER },
    series: { type: Schema.Types.ObjectId, ref: "series" }
  },
  {

    timestamps: true,
    versionKey: false
  }
);

const User = model("users", userSchema);

module.exports = User;
