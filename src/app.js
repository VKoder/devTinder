const express = require('express')

const app = express();

app.use('/hey', (req, res)=>{
    res.send('This is running on hey path')
})

app.use('/test',(req, res)=>{
    res.send('This is running on /test path')
})
app.listen(7777, ()=>{
    console.log('The server is running on 7777 successfully...')
})