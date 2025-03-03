const Convention = require('../models/Convention');
const ApiError = require('../utils/ApiError');
const pdfGenerator = require('../services/pdfGenerator');

class ConventionController {
  /**
   * Crée une nouvelle convention.
   */
  async createConvention(req, res, next) {
    try {
      const data = req.body;
      // TODO: Ajouter une validation stricte des données
      const convention = await Convention.create(data);
      return res.status(201).json({
        status: "success",
        data: convention.toJSON()
      });
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

  /**
   * Génère et renvoie le PDF de la convention.
   */
  async generateConventionPDF(req, res, next) {
    try {
      const { id } = req.params;
      const convention = await Convention.findById(id);
      if (!convention) {
        throw new ApiError(404, "Convention non trouvée");
      }
      // On suppose que pdfGenerator.generateConvention accepte un objet JSON
      const pdfBytes = await pdfGenerator.generateConvention(convention.toJSON());
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=convention_${id}.pdf`);
      return res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConventionController();
