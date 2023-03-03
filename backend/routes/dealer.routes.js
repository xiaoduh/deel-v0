const express = require("express");
const {
  createDealer,
  editDealer,
  getAllDealers,
  getUniqueDealer,
} = require("../controllers/dealer.controllers");
const router = express.Router();

router.get("/:id", getUniqueDealer);
router.get("/", getAllDealers);
router.post("/", createDealer);
router.put("/:id", editDealer);

module.exports = router;
