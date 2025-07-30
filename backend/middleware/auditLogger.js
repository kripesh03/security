const Audit = require('../models/AuditLog') // your logs collection
const User = require('../models/user/User')

const auditLogger = async (req, res, next) => {
  try {
    let email = 'Unknown'

    // If req.user is populated (after authentication middleware), get email
    if (req.user) {
      const user = await User.findById(req.user).select('email').lean()
      if (user?.email) email = user.email
    }

    await Audit.create({
      email,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    })

  } catch (err) {
    console.error('Audit log error:', err.message)
  } finally {
    next()
  }
}

module.exports = auditLogger
