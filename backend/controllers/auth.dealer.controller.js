const DealerModel = require("../models/dealer.model");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
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
