const Stripe = require("stripe");
const dotenv = require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);

module.exports.payment = async (req, res) => {
  let { amount, id } = req.body;
  console.log("amount & id", amount, id);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "EUR",
      description: "Crédits deel",
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
