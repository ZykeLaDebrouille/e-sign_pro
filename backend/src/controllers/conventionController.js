/**
 * Contrôleur pour la gestion des conventions de stage
 * Points d'entrée API pour les opérations CRUD sur les conventions
 */
const Convention = require('../models/Convention');
const ApiError = require('../utils/ApiError');
const pdfGenerator = require('../services/pdfGenerator');

class ConventionController {
  /**
   * Génère un document PDF à partir des données d'une convention
   * @route POST /api/conventions/generate-pdf
   */
  async generateConventionPDF(req, res, next) {
    try {
      const data = req.body;
      // Génère le PDF via le service dédié
      const pdfBytes = await pdfGenerator.generateConvention(data);
      
      // Configuration pour le téléchargement du fichier
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=convention.pdf`);
      
      // Envoi du PDF
      return res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère une convention par son ID
   * @route GET /api/conventions/:id
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
   * Met à jour une convention existante
   * @route PUT /api/conventions/:id
   */
  async updateConvention(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Vérification de l'existence de la convention
      let convention = await Convention.findById(id);
      if (!convention) {
        throw new ApiError(404, "Convention non trouvée");
      }
      
      // Application des modifications
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
   * Supprime logiquement une convention (soft delete)
   * @route DELETE /api/conventions/:id
   */
  async softDeleteConvention(req, res, next) {
    try {
      const { id } = req.params;
      const convention = await Convention.findById(id);
      
      if (!convention) {
        throw new ApiError(404, "Convention non trouvée");
      }
      
      await convention.softDelete();
      return res.status(204).send(); // Succès sans contenu
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConventionController();
