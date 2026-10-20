const express = require('express');
const connectionRequestRouter = express.Router();

const {userAuth} = require('../middlewares/auth')
const {connectionRequestModel} = require('../models/connectionRequest');
const { userModel } = require('../models/user');

connectionRequestRouter.post('/request/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const allowedStatuses = ['ignored', 'interested']
        const { status, toUserId } = req.params
        const user = req.user

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Status is not valid')
        }

        const request = new connectionRequestModel({
            fromUserId: user._id,
            toUserId,
            status
        })

        // findById returns the matching user document, or null if no user exists.
        const toUser = await userModel.findById(toUserId)
        console.log('Recipient lookup:', toUser)
        if (!toUser) {
            return res.status(404).send('Recipient user not found')
        }

        // no duplicate request and both cant send to each other 
        const existingRequest = await connectionRequestModel.findOne({
            $or: [
                { fromUserId: user._id, toUserId },
                { fromUserId: toUserId, toUserId: user._id }
            ]
        })

        if (existingRequest) {
            return res.status(409).send('A connection request already exists between these users')
        }

       await request.save()
        res.send('Data added successfully')
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = { connectionRequestRouter }