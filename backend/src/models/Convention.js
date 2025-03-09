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
   * Crée une nouvelle convention
   * @param {Object} data - Propriétés de la convention à créer
   * @returns {Promise<Convention>} Instance de la convention créée
   */
  static async create(data) {
    try {
      // Requête SQL d'insertion avec valeurs paramétrées
      const sql = `
        INSERT INTO conventions 
        (eleve_id, entreprise_id, date_debut, date_fin, nb_semaines, status, sujet_stage, 
        gratification_montant, gratification_periode, horaires_travail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await database.run(sql, [
        data.eleve_id,
        data.entreprise_id,
        data.date_debut,
        data.date_fin,
        data.nb_semaines,
        data.status || 'brouillon',  // Valeur par défaut
        data.sujet_stage,
        data.gratification_montant,
        data.gratification_periode,
        data.horaires_travail
      ]);
      
      // Retourne l'objet complet avec l'ID généré
      return await Convention.findById(result.lastID);
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la création de la convention");
    }
  }

  /**
   * Récupère une convention par son ID
   * @param {number} id - ID de la convention à récupérer
   * @returns {Promise<Convention>} Instance de la convention
   */
  static async findById(id) {
    try {
      // N'inclut que les conventions non supprimées (soft delete)
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
   * Met à jour les champs d'une convention existante
   * @param {Object} updates - Champs à mettre à jour
   * @returns {Promise<Convention>} Instance mise à jour
   */
  async update(updates) {
    try {
      // Liste des champs modifiables (sécurité)
      const allowedFields = [
        'date_debut', 'date_fin', 'nb_semaines', 'status',
        'sujet_stage', 'gratification_montant', 'gratification_periode', 'horaires_travail'
      ];
      
      // Filtrer pour ne garder que les champs autorisés
      const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
      
      if (fields.length === 0) {
        return this;  // Rien à mettre à jour
      }
      
      // Construction dynamique de la requête SQL
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(this.id);  // Pour la clause WHERE
      
      const sql = `UPDATE conventions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await database.run(sql, values);
      
      // Recharger la convention mise à jour
      const updatedConvention = await Convention.findById(this.id);
      Object.assign(this, updatedConvention);  // Mettre à jour l'instance courante
      
      return this;
    } catch (error) {
      throw new ApiError(500, "Erreur lors de la mise à jour de la convention");
    }
  }

  /**
   * Suppression logique (soft delete) d'une convention
   * Marque la convention comme supprimée sans la retirer de la base
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
   * Convertit l'instance en objet JSON simple pour les API responses
   * Exclut les champs sensibles ou techniques comme deleted_at
   * @returns {Object} Objet convention formaté pour l'API
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
