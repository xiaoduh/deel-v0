const express = require("express");
const { createLead } = require("../controllers/lead.controllers");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "leads" });
});

router.post("/", createLead);

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
