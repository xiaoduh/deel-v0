const express = require("express");
const {
  createUser,
  editUser,
  getAllUsers,
  getUniqueUser,
} = require("../controllers/user.controllers");
const router = express.Router();

router.get("/:id", getUniqueUser);
router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", editUser);

router.patch("/lead-bought/:id", (req, res) => {
  res.json({ message: "Lead acheté :" + req.params.id });
});

module.exports = router;
