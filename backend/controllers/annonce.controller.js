const AnnonceModel = require("../models/annonce.model");
const UserModel = require("../models/user.model");

module.exports.postAnnonce = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.posterID);
    const newAnnonce = await AnnonceModel.create({
      posterID: req.body.posterID,
      type: req.body.type,
      title: req.body.title,
      detail: req.body.detail,
      result: req.body.result,
      budgetMax: req.body.budgetMax,
    });
    console.log(newAnnonce);
    const userModified = await UserModel.findByIdAndUpdate(
      req.body.posterID,
      { $set: { nb_annonce: user.nb_annonce + 1 } },
      { new: true }
    );
    console.log(userModified);
    res.status(200).json(newAnnonce);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getAnnonces = async (req, res) => {
  const annonces = await AnnonceModel.find().sort({ createdAt: -1 });
  res.status(200).json(annonces);
};
