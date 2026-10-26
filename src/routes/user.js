const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { connectionRequestModel } = require('../models/connectionRequest');
const { populate } = require('dotenv');
const { userModel } = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_FIELDS = "firstName lastName age gender avatar skills about bio gallery"

userRouter.get('/user/pending/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allRequest = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_FIELDS)

        res.json({
            message: 'Requested fetched successfully!',
            allRequest
        })
    }
    catch (err) {
        res.status(400).send('Error' + err)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // A -> B and B -> A both are accpeted case but the users are changed so need to handle that 
        // logged-in user can be on either side; check both fromUserId and toUserId.
        const connectionRequests = await connectionRequestModel.find({
            $or: [{
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
        const data = connectionRequests.map((row) => {
            // check to handle the profile of current user will not be shown and always show the profile of connected user simple :)
            if (row.fromUserId.equals(loggedInUser._id)) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message: 'Connections fetched successfully!',
            data
        })
    }
    catch (err) {
        res.status(400).send('Error' + err)
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Converting the query to integer
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit


        // Corner cases
        // 1. Logged user should not be shown
        // 2. current user and the end user should not be in accepted/ignored and rejected status ie 
        // no request between the both user already exists 

        const allRequests = await connectionRequestModel.find({
            $or: [{ toUserId: loggedInUser._id },{fromUserId: loggedInUser._id}]
        }).select('fromUserId').select('toUserId');

        // SET -  data str when u add mul elems its like an array but it only adds unique no duplicate 
        // remember dsa question of remv duplicates from the array thats it 
        const hideRequestedUser = new Set();
        allRequests.forEach((request) => {
            hideRequestedUser.add(request.fromUserId.toString());
            hideRequestedUser.add(request.toUserId.toString());
        })

        // Now we need to find all the user by skipping these hideRequestUser id 
        const users = await userModel.find({
           $and:[
            { _id : { $nin : Array.from(hideRequestedUser) }},
            {_id: { $ne : loggedInUser._id }}
        ] 
        // select is basically data obj me se kkonsi fields show krni hai and populate means specific feild se konsi ref field show krni hai like agr fromUserId ya toUserId hoti unko USER ka ref diya hai to agr ye dono fields aati to we can get the user fields out of them but we are here alreadyy getting the user fields so will only show safe fields okay!
        }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

        res.send(users)
    } catch (err) {
        res.status(400).send('ERROR' + err)
    }
})

module.exports = { userRouter }