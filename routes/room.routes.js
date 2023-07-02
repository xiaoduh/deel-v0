const express = require("express");
const roomController = require("../controllers/room.controller");
const router = express.Router();

router.get("/", roomController.getRooms);
router.post("/", roomController.createRoom);

module.exports = router;
