const express = require("express");
const leadController = require("../controllers/lead.controllers");
const router = express.Router();

router.get("/", leadController.getLeads);
router.post("/", leadController.createLead);
router.put("/:id", leadController.editLead);
router.patch("/buy-lead/:id", leadController.buyLead);
router.delete("/:id", leadController.removeLead);

module.exports = router;
