const express = require('express')
const connectDB = require('./config/database')
const app = express()
const cookieParcer = require('cookie-parser')
const {authRouter} = require('./routes/auth')
const {profileRouter} = require('./routes/profile')
const {requestRouter} = require('./routes/request')
const { userRouter } = require('./routes/user')
const cors = require('cors')

// Below app.use is ntg but a MIDDLEWARE for all the paths we have added a express.json ie its a reqhandler
// Description : convert the request to readable js object and adds the object into .body 
app.use(express.json());

// Makes the cookie into readable format when we do req.cookiee in rh
app.use(cookieParcer())

app.use(cors({
    // whitelisting the frontend domain to allow the request
     origin: [
      "http://localhost:5173",
      "http://192.168.1.4:5173",
    ],
    credentials: true
}))

app.use('/', authRouter);
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)



 
const port = process.env.PORT || 7777

connectDB()
    .then(() => {
        console.log('DB is Successfully connected and then only will listen or start the server');
        app.listen(port, () => {
            console.log(`Running successfully on port ${port}....`)
        })
    })
    .catch((err) => {
        console.error(err)
    })



//     - go to mongo db atlas -> add ipv4 ie aws instance ka ip address and add that in mongo db allow list (whitelisting the ip of ec2 instance)

//     - then do npm start to test and check -> it will strat on ip:7777 port but we need to set the inbound rules to add  7777 so do that

//     - now ur backend is running but we need to keep it permantly running if u close th termial it will suspned so to continusly keep it running we need to do 


//     - will use a packge called pm2 -> PM2 is a daemon process manager that will help you manage and keep your application online 24/7
//     its a process manager 


//     - npm install pm2 -g


//     - pm2 start npm -- start


//     -pm2 logs (to check the logs to debug)


//     - pm2 list
//     - pm2 flush <name>
//     - pm2 stop <name>

//     // giving custom name 

//     eg pm2 start npm -- name "devTinder-Backend" -- start




//     - proxy pass /api to 7777 

//     - nano to edit the file -> do localhost make usre to add / after 7777

//     - once it is done restrt the ngix using sudo systemctl restrat ngix

//     location /api/ {
//     proxy_pass http://localhost:7777/;

//     proxy_http_version 1.1;
//     proxy_set_header Host $host;
//     proxy_set_header X-Real-IP $remote_addr;
//     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//     proxy_set_header X-Forwarded-Proto $scheme;
// }


// modify the base url in fe to /api -> it will automatically take your server ip instead of localhost:7777 just use /api 



//note if u chnage anyting anythinng is ur local or repo u have to do git pull in your server terminal and build it again  so eg ->>> change BASE URL to /api and push it take pull in ur ubuntau and do make its build and it will wrk and agian do the copying recusrivness 