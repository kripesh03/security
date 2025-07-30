// models/log/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  email: { type: String, default: 'Unknown' },
  method: { type: String, required: true },
  url: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
