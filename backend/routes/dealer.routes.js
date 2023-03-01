const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "dealer" });
});

router.post("/", (req, res) => {
  res.json({ dealer: req.body });
});

router.put("/:id", (req, res) => {
  res.json({ dealerId: req.params.id });
});

module.exports = router;
