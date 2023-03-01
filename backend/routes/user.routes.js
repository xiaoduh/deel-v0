const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  res.json({ message: "user" });
});

router.post("/", (req, res) => {
  res.json({ lead: req.body });
});

router.put("/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

router.patch("/lead-bought/:id", (req, res) => {
  res.json({ message: "Lead acheté :" + req.params.id });
});

module.exports = router;
