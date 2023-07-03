const RoomModel = require("../models/room.model");
const UserModel = require("../models/user.model");
const sendEmail = require("../utils/sendEmail.utils");

module.exports.getRooms = async (req, res) => {
  const rooms = await RoomModel.find().sort({ createdAt: -1 });
  res.status(200).json(rooms);
};

module.exports.createRoom = async (req, res) => {
  try {
    const rooms = await RoomModel.find();

    const duplicate = await rooms.find(
      (el) =>
        el.uniqueID === req.body.annonceID + req.body.posterID + req.body.userID
    );

    if (duplicate) {
      res.status(200).json({ duplicate: true });
    } else if (req.body.posterID === req.body.userID) {
      res.status(200).json({ duplicate: true });
    } else {
      const newUniqueRoom = await RoomModel.create({
        annonceID: req.body.annonceID,
        posterID: req.body.posterID,
        userID: req.body.userID,
        uniqueID: req.body.annonceID + req.body.posterID + req.body.userID,
      });
      const user = await UserModel.findById(req.body.posterID);
      // console.log(user);
      const url1 = "https://deeel-app.com/";
      const url2 = "https://deeel-app.com/";
      const text = `Bonjour ${user.pseudo}, un informateur s'est intéressé à votre recherche. Connectez-vous pour prendre contact avec lui. ${url1} Cordialement, deeel `;

      await sendEmail(
        user.email,
        "Un informateur peut vous aider - deeel",
        text,
        url2
      );
      res.status(200).json(newUniqueRoom);
    }
  } catch (error) {
    res.status(201).json({ error: "conversation already exist !" });
  }
};
