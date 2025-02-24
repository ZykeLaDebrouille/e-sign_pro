// /src/controllers/conventionController.js
const pdfGenerator = require('../services/pdfGenerator');
const conventionFields = require('../config/conventionFields');

class ConventionController {
  async generateConvention(req, res, next) {
    try {
      const conventionData = req.body;
      
      // Valider les données reçues contre le schéma
      // TODO: Ajouter la validation

      // Générer le PDF
      const pdfBytes = await pdfGenerator.generateConvention(conventionData);

      // Envoyer le PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=convention.pdf');
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConventionController();
