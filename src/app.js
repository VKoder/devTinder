const express = require('express')
const app = express()

app.use('/', (req, res) => {
    try {
        throw new Error('Error')
        res.send('Sent')
    }
    catch (err) {
        res.status(500).send('Handled error')
    }
})


// can write like this in the end to handle the error but always use try catch
app.use('/', (err, req, res, next)=>{
    if(err){ 
        res.status(500).send('Handled error')
    }
})
app.listen(7777, () => {
    console.log('Running successfully on port 7777....')
})