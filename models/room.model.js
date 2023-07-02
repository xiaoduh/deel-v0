const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    annonceID: {
      type: String,
      required: true,
    },
    posterID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    uniqueID: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", roomSchema);
