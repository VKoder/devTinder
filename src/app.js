const express = require('express')
const connectDB = require('./config/database')
const { userModel } = require('./models/user')
const app = express()

// Below app.use is ntg but a MIDDLEWARE for all the paths we have added a express.json ie its a reqhandler
// Description : convert the request to readable js object and adds the object into .body 
app.use('/', express.json());

// making post call to singup the user
app.post('/signup', async (req, res) => {
    console.log(req.body)
    // Creating a new instance of the user modal
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

// find all the emails find() will send in arry of obj
app.get('/users', async (req, res) => {
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
app.get('/user', async (req, res) => {
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

// delete
app.delete('/user', async (req, res)=>{
    const userId = req.body._id;
    try{
        const user = await userModel.findByIdAndDelete(userId)
        res.send('User deleted successfully')
    }
    catch(err){
        res.status(400).send('Something went wrg')
    }
})


app.get('/feed', async (req, res) => {
    try {
        const users = await userModel.find({})
        res.send(users)
    }
    catch (err) {
        //400 - The server could not understand the request. Maybe a bad syntax?
        res.status(400).send('Something went wrg')
    }
})

connectDB()
    .then(() => {
        console.log('DB is Successfully connected and then only will listen or start the server');
        app.listen(7777, () => {
            console.log('Running successfully on port 7777....')
        })
    })
    .catch((err) => {
        console.error(err)
    })
