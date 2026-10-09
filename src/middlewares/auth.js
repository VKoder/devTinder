const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user');


const userAuth = async (req, res, next) => {
    try {
        // Read the token from the req cookie
        const { token } = req.cookies
        if(!token){
            throw new Error('Token is invalid')
        }
        // Validate the Token
        const decodedObj = await jwt.verify(token, "AIDEV");
        const { _id } = decodedObj
        // Find the user 
        const user = await userModel.findById({ _id });
        if (!user) {
            throw new Error('User not found')
        }
        next()
    } catch (err) {
        res.status(400).send("Error" + err.message)
    }
}
module.exports = {
     userAuth
}