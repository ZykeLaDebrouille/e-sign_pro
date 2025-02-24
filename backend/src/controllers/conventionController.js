// src/controllers/conventionController.js
const ConventionService = require('../services/conventionService');

class ConventionController {
    async createConvention(req, res) {
        try {
            const { eleve_id, entreprise_id } = req.body;
            const convention = await ConventionService.createNewConvention(eleve_id, entreprise_id);
            res.json(convention);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateConvention(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const convention = await ConventionService.updateConvention(id, updates);
            res.json(convention);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getConvention(req, res) {
        try {
            const { id } = req.params;
            const convention = await ConventionService.getConvention(id);
            res.json(convention);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async generatePDF(req, res) {
        try {
            const { id } = req.params;
            const pdfBuffer = await ConventionService.generatePDF(id);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=convention_${id}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ConventionController();
