const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    convID: {
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
