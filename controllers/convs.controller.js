const conversationModel = require("../models/conversation.model");

module.exports.getConvs = async (req, res) => {
  const convs = await conversationModel.find().sort({ createdAt: -1 });
  res.status(200).json(convs);
};
