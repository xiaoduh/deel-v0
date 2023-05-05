const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    leadID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    dealerID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);
