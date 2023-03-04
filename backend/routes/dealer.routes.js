const express = require("express");
const authDealerController = require("../controllers/auth.dealer.controller");
const dealerController = require("../controllers/dealer.controllers");
const router = express.Router();

// auth
router.post("/register", authDealerController.signUpDealer);
router.post("/login", authDealerController.signInDealer);
router.get("/logout", authDealerController.logOutDealer);

// CRUD
router.get("/:id", dealerController.getUniqueDealer);
router.get("/", dealerController.getAllDealers);
router.put("/:id", dealerController.editDealer);

module.exports = router;
