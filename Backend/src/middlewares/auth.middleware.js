
const connectToDB = require('../config/db'); 
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

async function authUser(req, res, next) {
    try {
        await connectToDB(); // Solves the buffering error
        
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const isTokenBlackListed = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlackListed) {
            return res.status(401).json({ message: "Token is invalid" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // req.user = {
        //     id: decoded.id
        // };
        req.user = {
        _id: decoded._id
};
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports = { authUser };