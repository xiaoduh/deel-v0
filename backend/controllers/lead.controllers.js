const LeadModel = require("../models/lead.model");

module.exports.createLead = async (req, res) => {
//   if (
//     !req.body.first_name ||
//     !req.body.last_name ||
//     !req.body.email ||
//     !req.body.role ||
//     !req.body.company ||
//     !req.body.lookingFor ||
//     !req.body.dealearID
//   )
//     res.status(400).json({ message: "requete vide" });

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
};
