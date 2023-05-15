const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const sendEmail = require("../utils/sendEmail.utils");

module.exports.editUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  const updateUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
    },
    { new: true }
  );

  return res.status(200).json(updateUser);
};

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.getUniqueUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const uniqueUser = await UserModel.findById(req.params.id).select(
    "-password"
  );
  if (uniqueUser) return res.status(200).json(uniqueUser);
  else console.log("ID unknown : " + req.params.id);
};

module.exports.convertCredit = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const withdraw = parseInt(req.body.withdraw);
    const userToWithdrawCredit = await UserModel.findById(req.params.id);
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { solde: userToWithdrawCredit.solde - withdraw },
      },
      { new: true, upsert: true }
    );

    const text = `Bonjour, vous avez une nouvelle demande de retrait. Utilisateur n° : ${user._id} d'un montant de ${withdraw}`;
    await sendEmail(
      "therealbigdeeel@gmail.com",
      "deeel.fr - Nouveau retrait",
      text,
      " crédits"
    );

    res.status(200).json({
      message: "withdraw successfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "withdraw failed",
      success: false,
    });
  }
};
