const express = require('express')
const userRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const { userModel } = require('../models/user')


// find all the emails find() will send in arry of obj
userRouter.get('/users', userAuth, async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await userModel.find({
            emailId: userEmail
        })
        // find() will give in array of obj
        if (users.length === 0) {
            res.status(404).send('User not found')
        }
        else {
            res.send(users)
        }
    }
    catch (err) {
        res.status(400).send('Something went wrg')
    }
})

// Returns one matching user as an object, but findOne() does not guarantee it is the oldest.
// To guarantee the oldest user, the schema must include createdAt and the query must sort by it ascending.
userRouter.get('/user', userAuth, async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await userModel.findOne({
            emailId: userEmail
        })
        // as its not an array its just an object
        if (!user) {
            res.status(404).send('User not found')
        }
        else {
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send('Something went wrg')
    }
})

// Delete a user by ID from the request body: DELETE /user
userRouter.delete('/user/', async (req, res) => {
    const userId = req.body._id
    try {
        // can delete it like this as well findOneAndDelete({ _id: id }).
        const deletedUser = await userModel.findByIdAndDelete(userId)

        if (!deletedUser) {
            return res.status(404).send('User not found')
        }

        res.send('User deleted successfully')
    }
    catch (err) {
        res.status(400).send('Invalid user ID')
    }
})


userRouter.patch('/user', async (req, res) => {
    const userId = req.body._id
    const data = req.body
    try {
        const user = await userModel.findByIdAndUpdate(userId, data)
        res.send('User updated successfully')
    }
    catch (err) {
        res.status(400).send('Something went wrg')
    }
})


//OPTIMZED 

// app.patch('/user', async (req, res) => {
//     const { _id, ...updates } = req.body

//     try {
//         const user = await userModel.findByIdAndUpdate(
//             _id,
//             updates,
//             { new: true, runValidators: true }
//         )

//         if (!user) {
//             return res.status(404).send('User not found')
//         }

//         res.send(user)
//     } catch (err) {
//         res.status(400).send('Invalid user data')
//     }
// })


// PATCH WITH EMAIL  - use findOneAndUpdate 

// app.patch('/user', async(req, res)=>{
//     const emailId = req.body.emailId
//     const data = req.body
//     try{
//         const user = await userModel.findOneAndUpdate({emailId}, data)
//         res.send('User updated successfully')
//     }
//     catch(err){
//         res.status(400).send('Something went wrg')
//     }
// })

module.exports = { userRouter }