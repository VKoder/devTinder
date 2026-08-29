const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : {
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String
    }
})
// note : model takes model name and schema 
const userModel = new mongoose.model('user', userSchema);
module.exports = {userModel}