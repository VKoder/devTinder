const mongoose = require('mongoose')

// way to connect with db cluster which we've created in atlas
// as its a asyns task need to wrap it in async await
const connectDB = async () => {
    const uri = `mongodb+srv://vivekkhule204_db_user:slVPu7bSxDgz5Zj6@devtinder.8swjnp9.mongodb.net/devtinder`
    await mongoose.connect(uri)
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`)
}

module.exports = connectDB

