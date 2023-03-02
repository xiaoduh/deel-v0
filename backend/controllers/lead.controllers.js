const LeadModel = require("../models/lead.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getLeads = async (req, res) => {
  const leads = await LeadModel.find();
  res.status(200).json(leads);
};

module.exports.createLead = async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.role ||
    !req.body.company ||
    !req.body.lookingFor ||
    !req.body.dealerID
  ) {
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
    return res.status(400).send("ID unknonw : " + req.params.id);

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

module.exports.buyLead = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    const newBuyer = await LeadModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { buyer: req.body.userID },
      },
      { new: true, upsert: true }
    );
    res.status(200).json(newBuyer);
  } catch (error) {
    res.status(400).json(error);
  }
};
