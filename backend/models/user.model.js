const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_username: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lead_bought: {
      type: [String],
    },
    coin: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
