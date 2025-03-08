const FIELD_ACCESS = {
  ELEVE: {
    editable: [
      'stagiaire_*',
      'transport_*',
      'restauration_*',
      'hebergement_*'
    ],
    readOnly: ['*'] // tout le reste
  },
  ENTREPRISE: {
    editable: [
      'entreprise_*',
      'horaires_*',
      'deplacements_*',
      'machines_*',
      'habilitation_*',
      'frais_*'
    ],
    readOnly: ['*']
  },
  PROFESSEUR: {
    editable: [
      'signature_prof_*'
    ],
    readOnly: ['*']
  },
  ADMIN: {
    editable: ['*'] // accès total
  }
};

module.exports = FIELD_ACCESS;