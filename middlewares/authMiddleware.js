const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Protect routes - required authentication
const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies first, then Authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (isDbConnected()) {
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } else {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Set token cookie
const setTokenCookie = (res, token) => {
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        // Critical for cross-origin (Localhost -> Vercel)
        secure: true,
        sameSite: 'none'
    };
    res.cookie('token', token, options);
};

module.exports = { protect, generateToken, setTokenCookie };
