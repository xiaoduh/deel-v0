const express = require("express");
const coinController = require("../controllers/coin.controllers");
const router = express.Router();

router.post("/:id", coinController.buyCoin);

module.exports = router;
