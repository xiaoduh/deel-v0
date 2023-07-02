const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
  {
    uniqueRoomID: {
      type: String,
    },
    annonceID: {
      type: String,
    },
    recipientID: {
      type: String,
    },
    userID: {
      type: String,
    },
    price: {
      type: String,
    },
    statut: {
      type: String,
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("offer", offerSchema);
