const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

//crud
router.get("/", leadController.getAllLeads);
router.post("/", leadController.createLead);
router.get("/:id", leadController.getLeadById);
router.put("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

//status update
router.patch("/:id/status", leadController.updateLeadStatus);

module.exports = router;