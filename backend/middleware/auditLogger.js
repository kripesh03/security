// middleware/auditLogger.js
const AuditLog = require("../models/AuditLog");

const auditLogger = async (req, res, next) => {
  try {
    const email = req.user?.email || "Unknown";

    await AuditLog.create({
      email,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
    // Don’t block request even if logging fails
  }

  next();
};

module.exports = auditLogger;
