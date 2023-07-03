const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail.utils");
const crypto = require("crypto");
const dotenv = require("dotenv").config();
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

//creation du compte + check de l'usertype + envoi d'un lien de validation d'email
module.exports.signUpUser = async (req, res) => {
  const { user_type, pseudo, email, phone_number, password } = req.body;

  try {
    if (user_type == "sales") {
      const user = await UserModel.create({
        user_type,
        pseudo,
        email,
        phone_number,
        password,
        isSales: true,
        isBusinessProvider: false,
      });

      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url2 = "http://deeel-app.com/";
      const text = `Bonjour ${user.pseudo}, bienvenue sur deeel. Votre compte a bien été créé. Vous pouvez dès maintenant trouver les informations qu'ils vous manquent et débrider votre business. Cordialement, deeel `;
      await sendEmail(
        user.email,
        "Félicitations ! Votre compte est créé - deeel",
        text,
        url2
      );

      res.status(201).json({ user });
    } else if (user_type == "business_provider") {
      const user = await UserModel.create({
        user_type,
        pseudo,
        email,
        phone_number,
        password,
        isSales: false,
        isBusinessProvider: true,
      });

      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url2 = "http://deeel-app.com/";
      const text = `Bonjour ${user.pseudo}, bienvenue sur deeel. Votre compte a bien été créé. Vous pouvez dès maintenant monétiser vos informations en répondant aux annonceurs. Cordialement, deeel `;
      await sendEmail(
        user.email,
        "Félicitations ! Votre compte est créé - deeel",
        text,
        url2
      );

      res.status(201).json({ user });
    } else {
      const user = await UserModel.create({
        user_type,
        pseudo,
        email,
        phone_number,
        password,
        isSales: true,
        isBusinessProvider: true,
      });

      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const text =
        "Bonjour, merci de suivre le lien ci après pour valider votre compte : ";
      await sendEmail(user.email, "deeel.fr - Validez votre Email", text, url);

      res.status(201).json({ user });
    }
  } catch (err) {
    let errors = {
      pseudo: "",
      email: "",
      phone_number: "",
      password: "",
    };

    console.log(err);

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Un compte existe déjà avec cet email";

    if (err.message.includes("password"))
      errors.password = "Votre mot de passe doit faire 6 caractères minimum";

    if (err.message.includes("phone_number"))
      errors.phone_number = "Veuillez renseigner un numéro de téléphone";

    if (err.message.includes("pseudo"))
      errors.first_name = "Veuillez renseigner un pseudo";

    res.status(200).json({ errors });
  }
};

//verification de l'email + validation du compte
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

//connexion utilisateur/ test si email est vérifié si oui connexion si non envoi d'un lien de validation
module.exports.signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      domain: "deeel-app.com",
      secure: true,
      httpOnly: true,
      maxAge: maxAge,
      SameSite: "None",
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    let errors = { email: "", password: "" };

    if (err.message.includes("email")) errors.email = "Email inconnu";

    if (err.message.includes("password"))
      errors.password = "Le mot de passe ne correspond pas";
    res.status(200).json({ errors });
  }
};

// déconnexion du user, 2FA passe à false, on retire le jwt, et on redirige le user sur /
module.exports.logoutUser = async (req, res) => {
  try {
    // await UserModel.findOneAndUpdate(
    //   {
    //     _id: req.params.id,
    //   },
    //   {
    //     $set: {
    //       twoFA: false,
    //     },
    //   },
    //   {
    //     new: true,
    //     upsert: true,
    //     setDefaultsOnInsert: true,
    //   }
    // );
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } catch (error) {}
};

// on test si l'email est connnu, si oui on crée un token, puis envoi un email avec un lien composé de l'id du user + le token_id
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

    const link = `http://deeel-app.com/api/user/user-reset-password/${user._id}/${token.token}`;
    const text =
      "Bonjour, pour changer votre mot de passe veuillez suivre le lien ci après : ";
    await sendEmail(
      user.email,
      "deeel.fr - changement de mot de passe",
      text,
      link
    );

    res.send("Un email t'a été envoyé à l'adresse Email renseignée");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

// on vérifie si le lien est valide user_id et token_id
module.exports.userResetPassword = async (req, res) => {
  const newPassword = req.body.password;
  console.log(newPassword);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    const salt = await bcrypt.genSalt();
    pw = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate(
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
