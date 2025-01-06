const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                if (!decoded?.id) {
                    res.status(401);
                    throw new Error('Invalid token. Please log in again.');
                }

                const user = await User.findById(decoded.id);
                if (!user) {
                    res.status(401);
                    throw new Error('User not found. Please log in again.');
                }

                req.user = user;
                next();
            }
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized. Token expired or invalid.' });
        }
    } else {
        res.status(401).json({ message: 'No token attached to the header.' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(403);
        throw new Error('User information not available in request.');
    }
    const { email } = req.user;
    try {
        const adminUser = await User.findOne({ email });
        if (!adminUser || adminUser.role !== 'admin') {
            res.status(403);
            throw new Error('You are not authorized as an admin.');
        }
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(403).json({ message: 'Admin authorization failed.' });
    }
});

module.exports = {authMiddleware, isAdmin};