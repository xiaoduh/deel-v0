const mongoose = require("mongoose");

const leadSchema = mongoose.Schema(
  {
    dealerID: {
      type: String,
      // required: true,
    },
    first_name: {
      type: String,
      // required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    phone_number: {
      type: String,
    },
    company: {
      type: String,
      // required: true,
    },
    lookingFor: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
    },
    buyer: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lead", leadSchema);
