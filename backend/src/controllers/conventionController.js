const Convention = require('../models/Convention');
const ApiError = require('../utils/ApiError');
const pdfGenerator = require('../services/pdfGenerator');

class ConventionController {
  /**
   * Génère le PDF de la convention.
   */
  async generateConventionPDF(req, res, next) {
    try {
      const data = req.body;
      // On suppose que pdfGenerator.generateConvention accepte un objet JSON
      const pdfBytes = await pdfGenerator.generateConvention(data);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=convention.pdf`);
      return res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère une convention par son ID.
   */
  async getConventionById(req, res, next) {
    try {
      const { id } = req.params;
      const convention = await Convention.findById(id);
      return res.status(200).json({
        status: "success",
        data: convention.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour une convention.
   */
  async updateConvention(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      let convention = await Convention.findById(id);
      if (!convention) {
        throw new ApiError(404, "Convention non trouvée");
      }
      convention = await convention.update(updates);
      return res.status(200).json({
        status: "success",
        data: convention.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime logiquement (soft delete) une convention.
   */
  async softDeleteConvention(req, res, next) {
    try {
      const { id } = req.params;
      const convention = await Convention.findById(id);
      if (!convention) {
        throw new ApiError(404, "Convention non trouvée");
      }
      await convention.softDelete();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConventionController();
