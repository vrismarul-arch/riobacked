import express from "express";
import {
  createLead,
  getLeads,
  updateLeadStatus,
  getLeadsChartData
} from "../controllers/leadsController.js";

const router = express.Router();

router.post("/submit-lead", createLead);
router.get("/", getLeads);
router.get("/chart-data", getLeadsChartData);

// ✨ FIX: Allow both PATCH & PUT
router.patch("/:id/status", updateLeadStatus);
router.put("/:id/status", updateLeadStatus);

export default router;
