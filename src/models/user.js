const mongoose = require('mongoose')
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150',
        trim: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Url not valid')
            }
        }
    },
    about: {
        type: String,
        default: 'New to DevTinder',
        trim: true,
        maxlength: 500
    },
    bio: {
        type: String,
        default: 'Hello! I am new to DevTinder.',
        trim: true,
        maxlength: 500
    },
    skills: {
        type: [{
            type: String,
            trim: true,
            maxlength: 50
        }],
        validate: {
            validator: skills => skills.length <= 10,
            message: 'A user cannot have more than 10 skills'
        }
    }
}, { timestamps: true })
// note : model takes model name and schema 
const userModel = mongoose.model('user', userSchema)
module.exports = {userModel}