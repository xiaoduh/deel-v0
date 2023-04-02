const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.buyCoin = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  try {
    const newCoin = parseInt(req.body.coin);
    const credit = await UserModel.findById(req.params.id);
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { coin: credit.coin + newCoin },
      },
      { new: true, upsert: true }
    );

    res.status(200).send(user);
  } catch (error) {
    res.status(400).json(error);
  }
};
