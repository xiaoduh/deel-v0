const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail.utils");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUpUser = async (req, res) => {
  const {
    user_username,
    first_name,
    last_name,
    email,
    phone_number,
    password,
  } = req.body;

  try {
    const user = await UserModel.create({
      user_username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.CLIENT_URL}/user/${user._id}/verify/${token.token}`;

    await sendEmail(user.email, "Validez votre Email", url);

    res
      .status(201)
      .json({ message: "An Email sent to your account please verify" });
  } catch (err) {
    let errors = {
      user_username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
    };

    if (
      err.code === 11000 &&
      Object.keys(err.keyValue)[0].includes("user_username")
    )
      errors.user_username = "Ton identifiant est déjà utilisé";

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

module.exports.verifyEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid link" });

    await UserModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          isVerified: true,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(token);
    await Token.deleteOne({ _id: token._id });
    res.status(200).send({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports.verifyPhoneNumber = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ message: "Utilisateur not found" });

    await UserModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          twoFA: true,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports.signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    if (!user.isVerified) {
      let token = await Token.findOne({
        userId: user._id,
      });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.CLIENT_URL}/user/${user._id}/verify/${token.token._id}`;

        await sendVerifyEmail(user.email, "Valider votre Email", url);
      }
      res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    let errors = { email: "", password: "" };

    if (err.message.includes("email")) errors.email = "Email inconnu";

    if (err.message.includes("password"))
      errors.password = "Le mot de passe ne correspond pas";
    res.status(200).json({ errors });
  }
};

module.exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.userForgotPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send("Il n'existe aucun compte correspondant à cette adresse email");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/reset-password/${user._id}/${token.token}`;
    await sendEmail(
      user.email,
      "Ta demande de changement de mot de passe sur Tekos",
      link
    );

    res.send("Un email t'as été envoyé à l'adresse Email renseignée");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports.userResetPassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};
