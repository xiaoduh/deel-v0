const conversationModel = require("../models/conversation.model");
const LeadModel = require("../models/lead.model");
const UserModel = require("../models/user.model");
const { substratCoin, isPositive } = require("../utils/balance.utils");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getLeads = async (req, res) => {
  const leads = await LeadModel.find().sort({ createdAt: -1 });
  res.status(200).json(leads);
};

module.exports.createLead = async (req, res) => {
  if (
    !req.body.company ||
    !req.body.lookingFor ||
    !req.body.dealerID ||
    !req.body.region ||
    !req.body.skills ||
    !req.body.provider ||
    !req.body.desc ||
    !req.body.price
  ) {
    res.status(400).json({ message: "requete incomplete" });
  } else {
    // const dealer = await UserModel.findById(req.body.dealerID);
    const newLead = await LeadModel.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      company: req.body.company,
      region: req.body.region,
      lookingFor: req.body.lookingFor,
      skills: req.body.skills,
      desc: req.body.desc,
      provider: req.body.provider,
      dealerID: req.body.dealerID,
      price: req.body.price,
    });

    // if (req.body.first_name && req.body.last_name) {
    //   if (req.body.provider === "esn") {
    //     const newNumberLead = await UserModel.findByIdAndUpdate(
    //       req.body.dealerID,
    //       {
    //         $set: { nb_lead: dealer.nb_lead + 1 },
    //         $set: { solde: dealer.solde + 15 },
    //       },
    //       { new: true, upsert: true }
    //     );
    //   } else {
    //     const newNumberLead = await UserModel.findByIdAndUpdate(
    //       req.body.dealerID,
    //       {
    //         $set: { nb_lead: dealer.nb_lead + 1 },
    //         $set: { solde: dealer.solde + 60 },
    //       },
    //       { new: true, upsert: true }
    //     );
    //   }
    // }

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
      phone: req.body.phone,
      role: req.body.role,
      company: req.body.company,
      sector: req.body.sector,
      region: req.body.region,
      lookingFor: req.body.lookingFor,
      skills: req.body.skills,
      role: req.body.role,
      isOpen: req.body.isOpen,
      isVerified: req.body.isVerified,
      status: req.body.status,
      price: req.body.price,
    },
    { new: true }
  );

  if (updateLead.status === "validated") {
    const user = await UserModel.findById(updateLead.dealerID);

    const editUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: { solde: user.solde + 100 },
      },
      { new: true, upsert: true }
    );
  }

  return res.status(200).json(updateLead);
};

module.exports.removeLead = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  console.log(req.params.id);

  try {
    const leadRemoved = await LeadModel.findByIdAndRemove(req.params.id);
    res.status(200).json(leadRemoved);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
};

// probably to relocated in stripe controllers
module.exports.buyLead = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const user = await UserModel.findById(req.body.userID);
  const dealer = await UserModel.findById(req.body.dealerID);
  const lead = await LeadModel.findById(req.params.id);

  if (!isPositive(user.coin))
    return res.status(400).send("Coins balance : " + user.coin);

  try {
    const addBuyerToLead = await LeadModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { buyer: req.body.userID },
      },
      { new: true, upsert: true }
    );

    const subPriceToBuyer = await UserModel.findByIdAndUpdate(
      req.body.userID,
      {
        $addToSet: { lead_bought: req.params.id },
        $set: { coin: substratCoin(user.coin, lead) },
      },
      { new: true, upsert: true }
    );

    const addGainToDealer = await UserModel.findByIdAndUpdate(
      req.body.dealerID,
      {
        $set: {
          solde: parseFloat(dealer.solde) + parseFloat(lead.price),
        },
      },
      { new: true, upsert: true }
    );

    console.log(addGainToDealer);

    const newConversation = await conversationModel.create({
      leadID: req.body.leadID,
      userID: req.body.userID,
      dealerID: req.body.dealerID,
    });
    res.status(200).json(newConversation);
  } catch (error) {
    res.status(400).json(error);
  }
};
