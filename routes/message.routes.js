const express = require("express");
const msgController = require("../controllers/message.controllers");
const router = express.Router();

router.post("/", msgController.postMsg);
router.get("/:id", msgController.getMsg);

module.exports = router;
