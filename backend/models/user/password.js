const mongoose = require('mongoose')

const passwordSchema = new mongoose.Schema({
  hashed: {
    type: String,
    required: true
  },
  errorCount: {
    type: Number,
    default: 0
  },
  errorDate: Date,
  history: {
    type: [String], // Store last 2 password hashes
    default: []
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
})
