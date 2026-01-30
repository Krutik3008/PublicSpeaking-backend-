const User = require('../models/User');
const { generateToken, setTokenCookie } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// In-memory user storage for fallback
let fallbackUsers = new Map();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email'
            });
        }

        if (!isDbConnected()) {
            // Use fallback system when database is not available
            if (fallbackUsers.has(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email. Please login instead.'
                });
            }

            const userId = Date.now().toString();
            const fallbackUser = { _id: userId, name, email, password };
            fallbackUsers.set(email, fallbackUser);
            
            const token = generateToken(userId);
            setTokenCookie(res, token);

            return res.status(201).json({
                success: true,
                data: { _id: userId, name, email, token }
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email. Please login instead.'
            });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            data: { _id: user._id, name: user.name, email: user.email, token }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        if (!isDbConnected()) {
            // Use fallback system when database is not available
            const fallbackUser = fallbackUsers.get(email);
            if (!fallbackUser || fallbackUser.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const token = generateToken(fallbackUser._id);
            setTokenCookie(res, token);
            
            return res.json({
                success: true,
                data: { _id: fallbackUser._id, name: fallbackUser.name, email: fallbackUser.email, token }
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);
        
        res.json({
            success: true,
            data: { _id: user._id, name: user.name, email: user.email, token }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true
    });
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        if (!isDbConnected()) {
            return res.json({
                success: true,
                data: req.user
            });
        }

        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile
};
