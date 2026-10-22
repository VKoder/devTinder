const express = require('express');
const connectionRequestRouter = express.Router();

const { userAuth } = require('../middlewares/auth')
const { connectionRequestModel } = require('../models/connectionRequest');
const { userModel } = require('../models/user');

connectionRequestRouter.post('/request/:status/:toUserId', userAuth, async (req, res) => {
    try {

        // grabbing all the values
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId
        const status = req.params.status

        // 1. status check 
        // 2. userId exists or not 
        // 3. no existing connection
        // 4. fromId and userId cant be same


        // 1. status check 

        const allowedStatuses = ['ignored', 'interested']
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Status is not valid')
        }


        // 2. userId exists or not 

        const toUser = await userModel.findById(toUserId)
        if (!toUser) {
            return res.status(404).send('User not found')
        }


        
        // 3. no existing connection - from both sides finding the connection where fromUserId and toUserId and vicaversa

        const existingRequest = await connectionRequestModel.findOne({
            $or:[
                {
                    fromUserId,toUserId
                },
                {
                    fromUserId:toUserId, toUserId:fromUserId
                }
            ]
        })
        if(existingRequest){
            return res.status(409).send('A connection request already exists between these users')
        }


        // 4. fromId and userId cant be same - written in schmea as a 'PRE' to understand pre we could write this logic here as well but to understnad the same we did in schema


        // Creating instance of connection request modal as request and can later do save
        const request = new connectionRequestModel({
            fromUserId, toUserId, status
        })


        await request.save()

        res.json({
            message: req.user.firstName  + status + toUser.firstName + 'successfully!',
            request
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = { connectionRequestRouter }