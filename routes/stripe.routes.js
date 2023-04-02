const express = require("express");
const stripeController = require("../controllers/stripe.controllers");
const router = express.Router();

router.post("/charge/:id", stripeController.payment);

module.exports = router;
