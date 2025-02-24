const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
    try {
        const pdfBytes = await pdfService.generateConvention(req.body);
        res.type('application/pdf').send(pdfBytes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Autres routes pour lister, modifier, supprimer les conventions
module.exports = router;
