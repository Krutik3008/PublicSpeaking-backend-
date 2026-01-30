const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Optional auth - attach user if token exists, but don't require it
const optionalAuth = async (req, res, next) => {
    let token;

    // Check for token in cookies first, then Authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (isDbConnected()) {
                req.user = await User.findById(decoded.id).select('-password');
            } else {
                // Fallback user object when DB not connected
                req.user = { _id: decoded.id, name: 'User', email: 'user@example.com' };
            }
        } catch (error) {
            // Token invalid, but that's okay for optional auth
            req.user = null;
        }
    }

    next();
};

module.exports = { optionalAuth };