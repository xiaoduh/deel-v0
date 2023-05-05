const Stripe = require("stripe");
const dotenv = require("dotenv").config();
const stripe = Stripe(
  "pk_live_51MmFnAAFkffstGEScgHou9CEY4fbTh8nu5nLW9D9CTVu7L3uk8CLmfK49N00i813C1Bd9Q8dMLFI1oTYepyzkFL800ydBeOcj1"
);
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.payment = async (req, res) => {
  let { amount, id, credit } = req.body;
  console.log("amount & id & coin", amount, id, credit);

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "EUR",
      description: "Crédits deel",
      payment_method: id,
      confirm: true,
    });

    const newCredit = parseInt(credit);
    const userToAddCredit = await UserModel.findById(req.params.id);
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { coin: userToAddCredit.coin + newCredit },
      },
      { new: true, upsert: true }
    );

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
