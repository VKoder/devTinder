const mongoose = require('mongoose')
require('dotenv').config()

// way to connect with db cluster which we've created in atlas
// as its a asyns task need to wrap it in async await
const connectDB = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('MONGODB_URI is not set in the environment')
    }

    await mongoose.connect(uri)
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`)
}

module.exports = connectDB

