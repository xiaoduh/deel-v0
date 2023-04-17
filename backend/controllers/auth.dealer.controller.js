const DealerModel = require("../models/dealer.model");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail.utils");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign(
    { id },
    "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5ceyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    {
      expiresIn: maxAge,
    }
  );
};

module.exports.signUpDealer = async (req, res) => {
  const {
    dealer_username,
    first_name,
    last_name,
    email,
    phone_number,
    password,
  } = req.body;

  try {
    const dealer = await DealerModel.create({
      dealer_username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });
    res.status(201).json({ dealer: dealer._id });
  } catch (err) {
    let errors = {
      dealer_username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
    };

    if (
      err.code === 11000 &&
      Object.keys(err.keyValue)[0].includes("dealer_username")
    )
      errors.dealer_username = "Ton identifiant est déjà utilisé";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Un compte existe déjà avec cet email";

    if (err.message.includes("password"))
      errors.password =
        "Ton password est trop court, il doit faire 6 caractères minimum";

    if (err.message.includes("phone_number"))
      errors.phone_number = "Ton téléphone n'est pas renseigné";

    if (err.message.includes("first_name"))
      errors.first_name = "Ton prénom n'est pas renseigné";

    if (err.message.includes("last_name"))
      errors.last_name = "Ton nom n'est pas renseigné";

    res.status(200).json({ errors });
  }
};

module.exports.signInDealer = async (req, res) => {
  console.log("connexion dealer");
  const { email, password } = req.body;

  try {
    const dealer = await DealerModel.login(email, password);
    const token = createToken(dealer._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ dealer: dealer._id });
  } catch (error) {
    let errors = { email: "", password: "" };

    if (error.message.includes("email")) errors.email = "Email inconnu";

    if (error.message.includes("password"))
      errors.password = "Le mot de passe ne correspond pas";
    res.status(200).json({ errors });
  }
};

module.exports.logOutDealer = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.dealerForgotPassword = async (req, res) => {
  try {
    const dealer = await DealerModel.findOne({ email: req.body.email });
    if (!dealer)
      return res
        .status(400)
        .send("Il n'existe aucun compte correspondant à cette adresse email");

    let token = await Token.findOne({ userId: dealer._id });
    if (!token) {
      token = await new Token({
        userId: dealer._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/dealer/dealer-reset-password/${dealer._id}/${token.token}`;
    const text =
      "Bonjour, pour changer votre mot de passe veuillez suivre le lien ci après : ";
    await sendEmail(
      dealer.email,
      "deeel.fr - changement de mot de passe",
      text,
      link
    );

    res.send("Un email t'as été envoyé à l'adresse Email renseignée");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports.dealerResetPassword = async (req, res) => {
  const newPassword = req.body.password;
  console.log(newPassword);
  try {
    const dealer = await DealerModel.findById(req.params.id);
    if (!dealer) return res.status(400).send("invalid id");

    const token = await Token.findOne({
      userId: dealer._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid token");

    const salt = await bcrypt.genSalt();
    pw = await bcrypt.hash(newPassword, salt);

    await DealerModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          password: pw,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};
