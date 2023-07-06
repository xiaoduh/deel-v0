const express = require("express");
const annonceController = require("../controllers/annonce.controller");
const router = express.Router();

router.post("/", annonceController.postAnnonce);
router.get("/", annonceController.getAnnonces);

module.exports = router;
