const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Document = require("../models/Document");
const { createEditableConvention } = require("../services/pdfGenerator");

// Applique l'authentification à toutes les routes
router.use(authMiddleware);

/**
 * @swagger
 * /documents/generate-editable-convention:
 *   get:
 *     summary: Générer une convention de stage éditable
 *     tags: [Documents]
 */
router.get("/generate-editable-convention", async (req, res) => {
  try {
    const pdfPath = await createEditableConvention();
    res.download(pdfPath, "convention_de_stage.pdf");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Récupérer les informations d'un document
 *     tags: [Documents]
 */
router.get("/:id", async (req, res) => {
  const documentId = req.params.id;
  try {
    const document = await Document.getById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document non trouvé" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /documents/save-convention:
 *   post:
 *     summary: Sauvegarder les informations d'un document
 *     tags: [Documents]
 */
router.post("/save-convention", async (req, res) => {
  const { studentInfo, documentId } = req.body;
  try {
    await Document.updateStudentInfo(documentId, studentInfo);
    res.json({ message: "Informations sauvegardées avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /documents/{id}/sign:
 *   post:
 *     summary: Signer un document
 *     tags: [Documents]
 */
router.post("/:id/sign", async (req, res) => {
  const { userId, role } = req.body;
  const documentId = req.params.id;
  try {
    await Document.sign(documentId, userId, role);
    res.json({ message: "Document signé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
