const mongoose = require('mongoose')

const DB_NAME = 'devTinderrrr'

const connectDB = async () => {
    const uri = `mongodb://vivekkhule07_db_user:C0DY7NfH76ZPBWPz@ac-kegkz5q-shard-00-00.n5ssqna.mongodb.net:27017,ac-kegkz5q-shard-00-01.n5ssqna.mongodb.net:27017,ac-kegkz5q-shard-00-02.n5ssqna.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-7hl6hf-shard-0&authSource=admin&appName=devTinder-Cluster`

    await mongoose.connect(uri)
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`)
}

module.exports = connectDB

