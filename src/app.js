const express = require('express')
const { adminAuth, userAuth } = require('./middlewares/auth')
const app = express();

app.use('/admin', adminAuth)

app.get('/admin', (req, res) => {
    res.send('If user is authticated then only it will work')
})

app.use('/user', userAuth, (req, res) => {
    console.log('This is user request')
    res.send('Send the user data')
})

app.listen(7777, () => {
    console.log('The server is successfully running on 7777....')
})