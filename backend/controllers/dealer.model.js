const DealerModel = require("../models/dealer.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createDealer = async (req, res) => {
  if (
    !req.body.username ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.phone_number ||
    !req.body.password
  ) {
    res.status(400).json({ message: "requete incomplete" });
  } else {
    const newDealer = await DealerModel.create({
      dealer_username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
    });

    res.status(200).json(newDealer);
  }
};

module.exports.editDealer = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID dealer unknown : " + req.params.id);

  const updateDealer = await DealerModel.findByIdAndUpdate(
    req.params.id,
    {
      dealer_username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
    },
    { new: true }
  );

  return res.status(200).json(updateDealer);
};

module.exports.getDealers = async (req, res) => {
  const dealers = await DealerModel.find();
  res.status(200).json(dealers);
};
