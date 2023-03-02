const express = require("express");
const {
  createDealer,
  editDealer,
  getDealers,
} = require("../controllers/dealer.model");
const router = express.Router();

router.get("/", getDealers);
router.post("/", createDealer);
router.put("/:id", editDealer);

module.exports = router;
