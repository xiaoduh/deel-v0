const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.editUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  const updateUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      user_username: req.body.user_username,
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
  const users = await UserModel.find().select("-password");;
  res.status(200).json(users);
};

module.exports.getUniqueUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const uniqueUser = await UserModel.findById(req.params.id).select("-password");;
  if (uniqueUser) return res.status(200).json(uniqueUser);
  else console.log("ID unknown : " + req.params.id);
};
