const express = require('express')
const connectDB = require('./config/database')
const { userModel } = require('./models/user')
const app = express()


// a middleware which will use for all the apis
// Description : convert the request to readable js object and adds the object into .body 
app.use('/', express.json());

// making post call to singup the user
app.post('/signup', async (req, res) => {
    // Creating a new instance of the user modal
    console.log(req.body)
    const user = new userModel(req.body)
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
