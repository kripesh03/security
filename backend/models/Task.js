const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        assignedTo: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        status: {
            type: String,
            required: true,
            default: "Pending"
        }
    }, {timestamps: true}
)

module.exports = mongoose.model('Task', taskSchema)