const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');
const jwt = require('jsonwebtoken');

// Soft auth — extracts user from token if present, but doesn't block guests
const softAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = decoded;
        }
    } catch {
        // Token invalid or missing — treat as guest, no error thrown
        req.user = null;
    }
    next();
};

// POST /api/chat — accessible by all (authenticated users get role-specific AI)
router.post('/', softAuth, chat);

module.exports = router;
