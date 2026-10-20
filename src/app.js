const express = require('express')
const connectDB = require('./config/database')
const app = express()
const cookieParcer = require('cookie-parser')
const {authRouter} = require('./routes/auth')
const {userRouter} = require('./routes/user')

// Below app.use is ntg but a MIDDLEWARE for all the paths we have added a express.json ie its a reqhandler
// Description : convert the request to readable js object and adds the object into .body 
app.use(express.json());

// Makes the cookie into readable format when we do req.cookiee in rh
app.use(cookieParcer())

app.use('/', authRouter);
app.use('/', userRouter)


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
