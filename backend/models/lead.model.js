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
    phone: {
      type: String,
      default: "",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    company: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
    },
    region: {
      type: String,
      required: true,
    },
    lookingFor: {
      type: String,
      required: true,
    },
    jobDesc: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: String,
      required: true,
    },
    desc: {
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
    status: {
      type: String,
      default: "pending",
    },
    provider: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lead", leadSchema);
