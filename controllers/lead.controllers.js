const DealerModel = require("../models/dealer.model");
const LeadModel = require("../models/lead.model");
const UserModel = require("../models/user.model");
const { substratCoin, addCoin, isPositive } = require("../utils/balance.utils");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getLeads = async (req, res) => {
  const leads = await LeadModel.find();
  res.status(200).json(leads);
};

module.exports.createLead = async (req, res) => {
  if (!req.body.company || !req.body.lookingFor || !req.body.dealerID) {
    res.status(400).json({ message: "requete incomplete" });
  } else {
    const newLead = await LeadModel.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      role: req.body.role,
      company: req.body.company,
      lookingFor: req.body.lookingFor,
      dealerID: req.body.dealerID,
    });

    res.status(200).json(newLead);
  }
};

module.exports.editLead = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID lead unknown: " + req.params.id);

  const updateLead = await LeadModel.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      company: req.body.company,
      lookingFor: req.body.lookingFor,
      role: req.body.role,
    },
    { new: true }
  );

  return res.status(200).json(updateLead);
};

// probably to relocated in stripe controllers
module.exports.buyLead = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const user = await UserModel.findById(req.body.userID);
  const dealer = await DealerModel.findById(req.body.dealerID);

  if (!isPositive(user.coin))
    return res.status(400).send("Coins balance : " + user.coin);

  try {
    const newBuyer = await LeadModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { buyer: req.body.userID },
      },
      { new: true, upsert: true }
    );

    const newLead = await UserModel.findByIdAndUpdate(
      req.body.userID,
      {
        $addToSet: { lead_bought: req.params.id },
        $set: { coin: substratCoin(user.coin) },
      },
      { new: true, upsert: true }
    );

    const newUserBuyer = await DealerModel.findByIdAndUpdate(
      req.body.dealerID,
      {
        $addToSet: { deal: req.params.id },
        $set: { coin: addCoin(dealer.coin) },
      },
      { new: true, upsert: true }
    );

    if (newBuyer && newLead && newUserBuyer)
      res.status(200).json(newBuyer, newLead, newUserBuyer);
  } catch (error) {
    res.status(400).json(error);
  }
};