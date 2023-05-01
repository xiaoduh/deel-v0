const express = require("express");
const convsController = require("../controllers/convs.controller");
const router = express.Router();

router.get("/", convsController.getConvs);

module.exports = router;
