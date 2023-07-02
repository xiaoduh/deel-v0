const OfferModel = require("../models/offer.model");
const UserModel = require("../models/user.model");
const sendEmail = require("../utils/sendEmail.utils");

module.exports.getOffers = async (req, res) => {
  const offers = await OfferModel.find().sort({ createdAt: -1 });
  res.status(200).json(offers);
};

module.exports.getOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await OfferModel.find({
      uniqueRoomID: { $in: [id] },
    }).sort({ createdAt: -1 });
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.ModifyOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const crediteur = req.body.crediteur;
    const credit = parseFloat(req.body.credit);
    console.log(credit);
    const findOffer = await OfferModel.findOneAndUpdate(
      {
        uniqueRoomID: { $in: [id] },
      },
      { $set: { statut: "closed" } },
      { new: true }
    );
    const gain = credit / 1.2;
    console.log(gain);
    const user = await UserModel.findById(crediteur);
    const soldeParsed = parseFloat(user.solde);
    const sumGain = soldeParsed + gain;
    const findCrediteur = await UserModel.findOneAndUpdate(
      user._id,
      { $set: { solde: String(sumGain) } },
      { new: true, upsert: true }
    );

    const url2 = "www.google.com";
    const text = `Bonjour ${user.pseudo}, votre offre a été accepté. Connectez-vous pour partager l'information à votre client. Cordialement, deeel `;

    await sendEmail(
      user.email,
      "Félicitations ! Votre offre est acceptée - deeel",
      text,
      url2
    );

    const offers = await OfferModel.find().sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.createOffer = async (req, res) => {
  try {
    const offers = await OfferModel.find();
    let offerExist = false;

    offers.map((offer) => {
      if (offer.uniqueRoomID === req.body.uniqueRoomID) {
        offerExist = true;
        return;
      } else {
        return;
      }
    });
    if (!offerExist) {
      if (
        !req.body.uniqueRoomID ||
        !req.body.annonceID ||
        !req.body.posterID ||
        !req.body.userID ||
        !req.body.price
      ) {
        res
          .status(400)
          .json({ message: "requete incomplete il manque des data" });
      } else {
        const newOffer = await OfferModel.create({
          uniqueRoomID: req.body.uniqueRoomID,
          annonceID: req.body.annonceID,
          posterID: req.body.posterID,
          userID: req.body.userID,
          price: req.body.price,
        });
        res.status(200).json(newOffer);
      }
    } else {
      res.status(200).json({ message: "Offer existe deja" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
