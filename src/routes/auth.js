const express = require('express')
const authRouter = express.Router();

const validator = require('validator')
const { userModel } = require('../models/user')
const validateUserData = require('../utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




// making post call to singup the user
authRouter.post('/signup', async (req, res) => {

    // Always wrap db operations with try/catch
    try {
        // validate the data
        validateUserData(req.body)
        const { firstName, lastName, emailId, password } = req.body
        // encrpting the password
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new userModel({
            firstName, lastName, emailId, password: hashPassword
        })
        await user.save();
        res.send('User logged in successfully')
    }
    catch (err) {
        res.status(400).send('Error saving the user' + err.message);
    }
})

authRouter.post('/login', async (req, res) => {

    try {

        const { emailId, password } = req.body
        // 1st always check that email is correct or not
        if (!validator.isEmail(emailId)) {
            throw new Error('Invalid user creds');
        }
        // 2nd check the user with that mail is there in db or not 
        const user = await userModel.findOne({ emailId: emailId })
        if (!user) {
            // dont expose that email is valid dont expose ur db details just throw invalid
            throw new Error('Invalid user creds');
        }
        // check if the password is correct or not 
        const isPasswordValid = await user.validatePassword(password)
        console.log('pass', isPasswordValid)
        if (isPasswordValid) {
            // async func anyday wkt takes user payload and secret key - here user is which we finded above not a model
            const token = await user.getJwt()
            console.log('tooken',token)

            // key as token
            res.cookie('token', token)

            res.send('User  logged in successfully')
        } else {
            throw new Error('Invalid user creds')
        }
    } catch (err) {
        res.status(400).send('Invalid creds' + err.message);
    }
})

module.exports = {authRouter}