const express = require('express')

const app = express();

// This will handle just get call to /user path
app.get('/user', (req, res)=>{
    res.send('Get user data')
})

app.post('/user', (req, res)=>{
    // logic of posting data to db 
    res.send('Post data to DB')
})


app.delete('/user', (req, res)=>{
    // logic of deleting data from db 
    res.send('Deleted data from DB')
})


// This will match all the HTTP method API calls to /test
app.use('/test',(req, res)=>{
    res.send('This is running on /test path')
})

app.listen(7777, ()=>{
    console.log('The server is running on 7777 successfully...')
})