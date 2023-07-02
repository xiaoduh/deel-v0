const RoomModel = require("../models/room.model");
const MessageModel = require("../models/message.model");

module.exports.postMsg = async (req, res) => {
  try {
    const newMsg = await MessageModel.create({
      convID: req.body.convID,
      senderID: req.body.senderID,
      recipientID: req.body.recipientID,
      text: req.body.text,
    });
    res.status(200).json(newMsg);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getMsg = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await MessageModel.find({
      roomID: { $in: [id] },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};
