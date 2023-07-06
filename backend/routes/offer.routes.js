const express = require("express");
const offerController = require("../controllers/offer.controllers");
const router = express.Router();

router.post("/", offerController.createOffer);
router.put("/:id", offerController.ModifyOffer);
router.get("/", offerController.getOffers);
router.get("/:id", offerController.getOffer);

module.exports = router;
