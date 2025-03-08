const database = require('../config/database');
const ApiError = require('../utils/ApiError');

class Convention {
  constructor(data) {
    this.id = data.id;
    this.eleve_id = data.eleve_id;
    this.entreprise_id = data.entreprise_id;
    this.date_debut = data.date_debut;
    this.date_fin = data.date_fin;
    this.nb_semaines = data.nb_semaines;
    this.status = data.status;
    this.sujet_stage = data.sujet_stage;
    this.gratification_montant = data.gratification_montant;
    this.gratification_periode = data.gratification_periode;
    this.horaires_travail = data.horaires_travail;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Crée une nouvelle convention.
   * @param {Object} data - Données de la convention.
   * @returns {Promise<Convention>}
   */
  static async create(data) {
    try {
      const sql = `
        INSERT INTO conventions 
        (eleve_id, entreprise_id, date_debut, date_fin, nb_semaines, status, sujet_stage, gratification_montant, gratification_periode, horaires_travail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await database.run(sql, [
        data.eleve_id,
        data.entreprise_id,
        data.date_debut,
        data.date_fin,
        data.nb_semaines,
        data.status || 'brouillon',
        data.sujet_stage,
        data.gratification_montant,
        data.gratification_periode,
        data.horaires_travail
      ]);
      return await Convention.findById(result.lastID);
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la création de la convention");
    }
  }

  /**
   * Récupère une convention par son ID.
   * @param {number} id - ID de la convention.
   * @returns {Promise<Convention>}
   */
  static async findById(id) {
    try {
      const sql = `SELECT * FROM conventions WHERE id = ? AND deleted_at IS NULL`;
      const row = await database.get(sql, [id]);
      if (!row) {
        throw new ApiError(404, "Convention non trouvée");
      }
      return new Convention(row);
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la récupération de la convention");
    }
  }

  /**
   * Met à jour les informations d'une convention.
   * @param {Object} updates - Champs à mettre à jour.
   * @returns {Promise<Convention>}
   */
  async update(updates) {
    try {
      // Liste des champs autorisés à être mis à jour
      const allowedFields = [
        'date_debut',
        'date_fin',
        'nb_semaines',
        'status',
        'sujet_stage',
        'gratification_montant',
        'gratification_periode',
        'horaires_travail'
      ];
      const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
      if (fields.length === 0) {
        return this;
      }
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(this.id);
      const sql = `UPDATE conventions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await database.run(sql, values);
      // Recharge la convention mise à jour
      const updatedConvention = await Convention.findById(this.id);
      Object.assign(this, updatedConvention);
      return this;
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la mise à jour de la convention");
    }
  }

  /**
   * Effectue une suppression logique (soft delete) de la convention.
   * @returns {Promise<void>}
   */
  async softDelete() {
    try {
      const sql = `UPDATE conventions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await database.run(sql, [this.id]);
      this.deleted_at = new Date().toISOString();
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la suppression de la convention");
    }
  }

  /**
   * Renvoie un objet JSON sans les informations sensibles.
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      eleve_id: this.eleve_id,
      entreprise_id: this.entreprise_id,
      date_debut: this.date_debut,
      date_fin: this.date_fin,
      nb_semaines: this.nb_semaines,
      status: this.status,
      sujet_stage: this.sujet_stage,
      gratification_montant: this.gratification_montant,
      gratification_periode: this.gratification_periode,
      horaires_travail: this.horaires_travail,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Convention;
