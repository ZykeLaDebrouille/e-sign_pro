const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { createEditableConvention } = require('../services/pdfGenerator');
const fs = require('fs').promises;

// Appliquez le middleware d'authentification à toutes les routes de documents
router.use(authMiddleware);

// Route pour générer la convention de stage éditable
router.get('/generate-editable-convention', async (req, res) => {
  try {
    const pdfPath = await createEditableConvention();
    res.download(pdfPath, 'convention_de_stage.pdf', async (err) => {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de l\'envoi du PDF' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour sauvegarder les informations remplies par l'élève
router.post('/save-convention', async (req, res) => {
  const { studentInfo, documentId } = req.body;
  try {
    await db.run('UPDATE documents SET student_info = ? WHERE id = ?', [JSON.stringify(studentInfo), documentId]);
    res.json({ message: 'Informations sauvegardées avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour obtenir les informations d'une convention
router.get('/:id', async (req, res) => {
  const documentId = req.params.id;
  try {
    const document = await db.get('SELECT * FROM documents WHERE id = ?', [documentId]);
    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour signer une convention
router.post('/:id/sign', async (req, res) => {
  const { userId, role } = req.body;
  const documentId = req.params.id;
  try {
    await db.run('INSERT INTO signatures (document_id, user_id, role, signed_at) VALUES (?, ?, ?, ?)', 
      [documentId, userId, role, new Date().toISOString()]);
    res.json({ message: 'Document signé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
