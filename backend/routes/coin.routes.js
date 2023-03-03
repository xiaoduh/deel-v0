const express = require("express");
const { buyCoin } = require("../controllers/coin.controllers");
const router = express.Router();

router.post("/:id", buyCoin);

module.exports = router;
