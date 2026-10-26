const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const { userModel } = require('../models/user')


// find all the emails find() will send in arry of obj
profileRouter.get('/users', userAuth, async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await userModel.find({
            emailId: userEmail
        }).select('-password')
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
profileRouter.get('/user', userAuth, async (req, res) => {
    try {
        const user = req.user
        // as its not an array its just an object
        if (!user) {
            res.status(404).send('User not found')
        }
        else {
            const profile = user.toObject()
            delete profile.password
            res.send(profile)
        }
    }
    catch (err) {
        res.status(400).send('Something went wrg')
    }
})

// Delete a user by ID from the request body: DELETE /user
profileRouter.delete('/user/', async (req, res) => {
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


profileRouter.patch('/user', userAuth, async (req, res) => {
    try {
        const { emailId, password, firstName, lastName, age, gender, avatar, about, bio, skills, gallery } = req.body

        if (emailId !== undefined || password !== undefined) {
            return res.status(400).send('Email and password cannot be changed through profile updates')
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('At least one profile field is required')
        }

        const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'avatar', 'about', 'bio', 'skills', 'gallery']
        const hasUnsupportedField = Object.keys(req.body).some(field => !allowedFields.includes(field) && field !== 'emailId' && field !== 'password')
        if (hasUnsupportedField) {
            return res.status(400).send('One or more profile fields cannot be updated')
        }

        const user = req.user
        if (firstName !== undefined) user.firstName = firstName
        if (lastName !== undefined) user.lastName = lastName
        if (age !== undefined) user.age = age
        if (gender !== undefined) user.gender = gender
        if (avatar !== undefined) user.avatar = avatar
        if (about !== undefined) user.about = about
        if (bio !== undefined) user.bio = bio
        if (skills !== undefined) user.skills = skills
        if (gallery !== undefined) {
            if (!Array.isArray(gallery)) {
                return res.status(400).send('Gallery must be an array of photo URLs or { img: URL } objects')
            }

            const photoUrls = gallery.map(photo => typeof photo === 'string' ? photo : photo?.img)
            if (!photoUrls.every(photoUrl => typeof photoUrl === 'string')) {
                return res.status(400).send('Each gallery item must be a photo URL or an { img: URL } object')
            }

            user.gallery = photoUrls
        }

        await user.save()

        const profile = user.toObject()
        delete profile.password
        return res.status(200).json({ message: 'Profile updated successfully', user: profile })
    } catch (err) {
        return res.status(400).send('Unable to update profile: ' + err.message)
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

module.exports = { profileRouter}