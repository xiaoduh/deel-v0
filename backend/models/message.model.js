const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    roomID: {
      type: String,
    },
    senderID: {
      type: String,
    },
    recipientID: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
