const express = require("express");
const {
  createLead,
  getLeads,
  editLead,
  buyLead,
} = require("../controllers/lead.controllers");
const router = express.Router();

router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", editLead);
router.patch("/buy-lead/:id", buyLead);
// router.delete("/:id", (req, res) => {
//   res.json({ message: " Lead supprimé :" + req.params.id });
// });

module.exports = router;
