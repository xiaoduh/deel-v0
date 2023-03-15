const { boolean } = require("joi");
const mongoose = require("mongoose");

const leadSchema = mongoose.Schema(
  {
    dealerID: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
    lookingFor: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
