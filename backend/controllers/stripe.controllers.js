const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

module.exports.payment = async (req, res) => {
  let { amount, id } = req.body;
  console.log("amount & id", amount, id);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "EUR",
      description: "Your company description",
      payment_method: id,
      confirm: true,
    });
    res.status(200).json({ message: "payment successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "payment failed",
      success: false,
    });
  }
};
