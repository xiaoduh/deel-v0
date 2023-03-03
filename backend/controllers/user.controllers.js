const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createUser = async (req, res) => {
  if (
    !req.body.username ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.phone_number ||
    !req.body.password
  ) {
    res.status(400).json({ message: "requete incomplete" });
  } else {
    const newUser = await UserModel.create({
      dealer_username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
    });

    res.status(200).json(newUser);
  }
};

module.exports.editUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  const updateUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      dealer_username: req.body.username,
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
  const users = await UserModel.find();
  res.status(200).json(users);
};

module.exports.getUniqueUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const uniqueUser = await UserModel.findById(req.params.id);
  if (uniqueUser) return res.status(200).json(uniqueUser);
  else console.log("ID unknown : " + req.params.id);
};
