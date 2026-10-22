const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
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

// PRE - is basically a middleware which calls before SAVEing to DB ie its called PRE saved
// always write normal function when writting method or pre okay!
connectionRequestSchema.pre("save", function(next){

    // instanceof this context
    const connectionRequest = this;


    // if(connectionRequest.fromUserId === connectionRequest.toUserId) ---> cannot compare it like this cox id's are objects 

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('Cannot send connection request to yourself')
    }

    // as its a middleware which calls before save so need to do next() before mongoose 9 u need to explicity call next but after 9v it will auto call the next 

    // next()

})

const connectionRequestModel = mongoose.model('connectionRequest', connectionRequestSchema)

module.exports = { connectionRequestModel }