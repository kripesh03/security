const express = require("express");
const router = express.Router();
const Audit = require("../models/AuditLog");
const requireAuth = require("../middleware/requireAuth");
const requireRoles = require("../middleware/requireRoles");
const ROLES = require("../config/rolesList");

router.get("/", requireAuth, requireRoles([ROLES.Root]), async (req, res) => {
  try {
    const logs = await Audit.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
