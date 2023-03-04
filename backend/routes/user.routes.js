const express = require("express");
const userController = require("../controllers/user.controllers");
const authUserController = require("../controllers/auth.user.controller");
const router = express.Router();

// auth
router.post("/register", authUserController.signUpUser);
router.post("/login", authUserController.signInUser);
router.get("/logout", authUserController.logoutUser);

// CRUD
router.get("/:id", userController.getUniqueUser);
router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);
router.put("/:id", userController.editUser);

// router.patch("/lead-bought/:id", (req, res) => {
//   res.json({ message: "Lead acheté :" + req.params.id });
// });

module.exports = router;
