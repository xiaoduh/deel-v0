const AnnonceModel = require("../models/annonce.model");

module.exports.postAnnonce = async (req, res) => {
  try {
    console.log("object");
    const newAnnonce = await AnnonceModel.create({
      posterID: req.body.posterID,
      type: req.body.type,
      title: req.body.title,
      detail: req.body.detail,
      result: req.body.result,
      budgetMax: req.body.budgetMax,
    });
    res.status(200).json(newAnnonce);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getAnnonces = async (req, res) => {
  const annonces = await AnnonceModel.find().sort({ createdAt: -1 });
  res.status(200).json(annonces);
};
