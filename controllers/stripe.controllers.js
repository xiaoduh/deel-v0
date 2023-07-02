const Stripe = require("stripe");
const dotenv = require("dotenv").config();
const stripe = Stripe(
  "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"
);
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.payment = async (req, res) => {
  let { amount, id } = req.body;
  console.log("amount & id", amount, id);

  const parsedAmount = await amount.replaceAll(".", "");

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: parsedAmount,
      currency: "EUR",
      description: "Mise en relation deeel",
      payment_method: id,
      confirm: true,
    });

    res.status(200).json({
      message: "payment successfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "payment failed",
      success: false,
    });
  }
};
