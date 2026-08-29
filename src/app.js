const express = require('express')
const connectDB = require('./config/database')
const { userModel } = require('./models/user')
const app = express()

// making post call to singup the user
app.post('/signup', async (req, res) => {
    // Creating a new instance of the user modal
    const user = new userModel({
        firstName: 'Vivek',
        lastName: 'Khule',
        emailId: 'test@124'
    })
    // Always wrap db operations with try/catch
    try {
        await user.save();
        res.send('User logged in successfully')
    }
    catch (err) {
        res.status(400).send('Error saving the user', err.message);
    }
})

connectDB()
    .then(() => {
        console.log('Success');
        app.listen(7777, () => {
            console.log('Running successfully on port 7777....')
        })
    })
    .catch((err) => {
        console.error(err)
    })
