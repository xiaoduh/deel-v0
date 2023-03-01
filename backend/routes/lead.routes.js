const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "leads" });
});

router.post("/", (req, res) => {
  res.json({ lead: req.body });
});

router.put("/:id", (req, res) => {
  res.json({ leadId: req.params.id });
});

router.delete("/:id", (req, res) => {
  res.json({ message: " Lead supprimé :" + req.params.id });
});

router.patch("/buy-lead/:id", (req, res) => {
  res.json({ message: "Lead acheté :" + req.params.id });
});

module.exports = router;
