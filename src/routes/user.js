const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { connectionRequestModel } = require('../models/connectionRequest');
const { populate } = require('dotenv');
const userRouter = express.Router();

const USER_SAFE_FIELDS = "firstName lastName age gender avatar skills about bio"

userRouter.get('/user/pending/requests', userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const allRequest = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_FIELDS)

        const data = allRequest.map((res)=> res.fromUserId)
        res.json({
            message : 'Requested fetched successfully!',
            data
        })
    }
    catch(err){
        res.status(400).send('Error' + err)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;

        // A -> B and B -> A both are accpeted case but the users are changed so need to handle that 
        // logged-in user can be on either side; check both fromUserId and toUserId.
        const connectionRequests = await connectionRequestModel.find({
            $or:[{
                toUserId: loggedInUser._id,
                status: 'accepted' 
            },
            {
                fromUserId: loggedInUser._id,
                status: 'accepted' 

            }]
            
        // need to populate in both the cases coz we dont kn that who requested whom maybe the current user is receiver or sender wdk right!
        }).populate("fromUserId", USER_SAFE_FIELDS).populate("toUserId", USER_SAFE_FIELDS)

        // JUST NEED THE DATA OF THE USER NOT EVRYTHING RELATED TO CONNECTION EG Status, touserid etc etc 
        const data = connectionRequests.map((row)=> {
            // check to handle the profile of current user will not be shown and always show the profile of connected user simple :)
            if(row.fromUserId.equals(loggedInUser._id)){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message : 'Connections fetched successfully!',
            data
        })
    }
    catch(err){
        res.status(400).send('Error' + err)
    }
})

module.exports = {userRouter}