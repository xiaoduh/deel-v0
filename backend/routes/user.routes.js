const express = require("express");
const userController = require("../controllers/user.controllers");
const authUserController = require("../controllers/auth.user.controller");
const router = express.Router();

// user auth
router.post("/register", authUserController.signUpUser);
router.post("/login", authUserController.signInUser);
router.get("/logout/:id", authUserController.logoutUser);
router.get("/:id/verify/:token", authUserController.verifyEmail);
router.put("/verify/number/:id", authUserController.verifyPhoneNumber);

// user Reset PW
router.post("/user-forgot-password", authUserController.userForgotPassword);
router.put(
  "/user-reset-password/:id/:token",
  authUserController.userResetPassword
);

// user CRUD
router.get("/:id", userController.getUniqueUser);
router.get("/", userController.getAllUsers);
router.put("/count-annonce/:id", userController.countAnnonce);
router.put("/count-response/:id", userController.countResponse);
// route pour effectuer une demande de retrait
router.put("/withdraw/:id", userController.convertCredit);

module.exports = router;
