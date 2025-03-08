// src/services/conventionService.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require('../config/database');

class ConventionService {
    async createNewConvention(eleve_id, entreprise_id) {
        const sql = `
            INSERT INTO conventions (
                eleve_id, 
                entreprise_id, 
                status
            ) VALUES (?, ?, 'brouillon')
            RETURNING *
        `;
        
        const convention = await db.get(sql, [eleve_id, entreprise_id]);
        return convention;
    }

    async updateConvention(id, updates) {
        const allowedFields = [
            'date_debut',
            'date_fin',
            'nb_semaines',
            'sujet_stage',
            'gratification_montant',
            'status'
        ];

        const fields = Object.keys(updates)
            .filter(key => allowedFields.includes(key));
        
        const sql = `
            UPDATE conventions 
            SET ${fields.map(f => `${f} = ?`).join(', ')},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            RETURNING *
        `;

        const values = [...fields.map(f => updates[f]), id];
        const convention = await db.get(sql, values);
        return convention;
    }

    async generatePDF(id) {
        // Récupérer toutes les données nécessaires
        const convention = await this.getConventionWithDetails(id);
        
        // Créer le PDF
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        
        // Ajouter le contenu au PDF
        doc.fontSize(16).text('Convention de Stage', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Élève: ${convention.eleve_nom} ${convention.eleve_prenom}`);
        // ... ajouter tous les autres champs ...

        doc.end();

        return Buffer.concat(buffers);
    }

    async getConventionWithDetails(id) {
        const sql = `
            SELECT 
                c.*,
                e.raison_sociale,
                e.siret,
                e.adresse as entreprise_adresse,
                u.nom as eleve_nom,
                u.prenom as eleve_prenom
            FROM conventions c
            JOIN entreprises e ON c.entreprise_id = e.id
            JOIN users u ON c.eleve_id = u.id
            WHERE c.id = ?
        `;
        
        return await db.get(sql, [id]);
    }
}

module.exports = new ConventionService();
