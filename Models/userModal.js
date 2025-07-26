const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // Added unique
    password: { type: String, required: true, select: false }, // Added select: false
    email: { type: String, required: true, unique: true }, // Added unique
    phone: { type: String },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Good to have timestamps on User model too
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
