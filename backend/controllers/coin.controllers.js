const UserModel = require("../models/user.model");

const ObjectID = require("mongoose").Types.ObjectId;

module.exports.buyCoin = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  try {
    const newCoin = parseInt(req.body.coin);
    const user = await UserModel.findById(req.params.id);

    user.coin = user.coin + newCoin;

    await user.save();

    res.status(200).send(newCoin + "coin added to user : " + req.params.id);
  } catch (error) {
    res.status(400).json(error);
  }
};
