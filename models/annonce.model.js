const mongoose = require("mongoose");

const annonceSchema = mongoose.Schema(
  {
    posterID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 40,
    },
    detail: {
      type: String,
      required: true,
      maxLength: 160,
    },
    result: {
      type: String,
      required: true,
      maxLength: 80,
    },
    budgetMax: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("annonce", annonceSchema);
