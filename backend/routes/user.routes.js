const express = require("express");
const userController = require("../controllers/user.controllers");
const authUserController = require("../controllers/auth.user.controller");
const router = express.Router();

// user auth
router.post("/register", authUserController.signUpUser);
router.post("/login", authUserController.signInUser);
router.get("/logout", authUserController.logoutUser);
router.get("/:id/verify/:token", authUserController.verifyEmail);

// user Reset PW
router.post("/user-forgot-password", authUserController.userForgotPassword);
router.post(
  "/user-reset-password/:id/:token",
  authUserController.userResetPassword
);

// user CRUD
router.get("/:id", userController.getUniqueUser);
router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);
router.put("/:id", userController.editUser);

// router.patch("/lead-bought/:id", (req, res) => {
//   res.json({ message: "Lead acheté :" + req.params.id });
// });

module.exports = router;
