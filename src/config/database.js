const mongoose = require('mongoose')

// way to connect with db cluster which we've created in atlas
// as its a asyns task need to wrap it in async await
const connectDB = async () => {
    const uri = process.env.MONGO_URI
    if (!uri) {
        throw new Error('MONGO_URI is not defined in .env')
    }
    await mongoose.connect(uri)
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`)
}

module.exports = connectDB

