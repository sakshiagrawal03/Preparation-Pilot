
const connectToDB = require('../config/db'); 
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,           
    sameSite: isProduction ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000,    
    path: '/'
};

async function registerUserController(req, res) {
    try {
        // DEBUG LOG: See exactly what frontend is sending
        await connectToDB();
        console.log("Registration Attempt Body:", req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User with the same email or username already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        // Payload key is 'id'
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: error.message });
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;
        if (token) {
            await tokenBlacklistModel.create({ token });
        }
        res.clearCookie('token', cookieOptions);
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
        return res.status(500).json({ message: "Logout failed" });
    }
}

async function getMeController(req, res) {
    try {
        // IMPORTANT: Changed from req.user._id to req.user.id to match JWT payload
        const user = await userModel.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User details fetched successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("getMe Error:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};