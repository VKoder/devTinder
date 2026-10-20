const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        // Identifies the related user model and lets Mongoose load that user with populate().
        ref: 'user',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        // This reference can also be populated to get the recipient's user document.
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            // {VALUE} is replaced with the invalid status supplied to the schema.
            message: '{VALUE} is not a valid status'
        }
    }
}, { timestamps: true })

const connectionRequestModel = mongoose.model('connectionRequest', connectionRequestSchema)

module.exports = { connectionRequestModel }