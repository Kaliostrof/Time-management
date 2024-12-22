const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    // projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Projects" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
