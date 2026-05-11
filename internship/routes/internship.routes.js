const express = require('express');
const router = express.Router();
const InternshipModel = require('../models/Internship.model');

// Public route - get all approved internships (with optional trade/level filter)
router.get('/public', async (req, res) => {
    try {
        const { trade, level, page, limit } = req.query;
        const result = await InternshipModel.getPublicInternships(
            trade || null,
            level || null,
            parseInt(page) || 1,
            parseInt(limit) || 12
        );
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
