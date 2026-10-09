const express = require('express')
const connectDB = require('./config/database')
const { userModel } = require('./models/user')
const validateUserData = require('./utils/validation')
const app = express()
const bcrypt = require('bcrypt')
const validator = require('validator')
const cookieParcer = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth} = require('./middlewares/auth')

// Below app.use is ntg but a MIDDLEWARE for all the paths we have added a express.json ie its a reqhandler
// Description : convert the request to readable js object and adds the object into .body 
app.use(express.json());

// Makes the cookie into readable format when we do req.cookiee in rh
app.use(cookieParcer())

// making post call to singup the user
app.post('/signup', async (req, res) => {

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

app.post('/login', async (req, res) => {

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
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            // async func anyday wkt takes user payload and secret key 
            const token = jwt.sign({_id: user._id}, "AIDEV");
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

// find all the emails find() will send in arry of obj
app.get('/users', async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const cookies = req.cookies;
        console.log(cookies)
        const {token} = cookies;
        console.log('tokkkk', token)
        const isTokenValid = jwt.verify(token,"AIDEV")
        if (!isTokenValid) {
            return res.status(401).send('Invalid token')
        }
        console.log('cookie',cookies)
        const users = await userModel.find({
            emailId: userEmail
        })
        console.log('uuu', users)
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
app.get('/user', userAuth, async (req, res) => {
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
app.delete('/user/', async (req, res) => {
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


app.patch('/user', async (req, res) => {
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
