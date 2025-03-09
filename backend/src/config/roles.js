// backend/src/config/roles.js
const ROLES = {
    ADMIN: 'ADMIN',
    ELEVE: 'ELEVE',
    PARENT: 'PARENT',
    PROFESSEUR: 'PROFESSEUR',
    ENTREPRISE: 'ENTREPRISE'
  };
  
  // Permissions par rôle
  const ROLE_PERMISSIONS = {
    ADMIN: ['*'], // L'admin peut tout faire
    ELEVE: ['sign_document', 'view_own_documents', 'edit_profile'],
    PARENT: ['sign_document', 'view_student_documents', 'edit_profile'],
    PROFESSEUR: ['create_convention', 'view_students', 'sign_document', 'edit_profile'],
    ENTREPRISE: ['sign_document', 'view_own_conventions', 'create_convention', 'edit_profile']
  };
  
  // Vérifier si un rôle a une permission spécifique
  const hasPermission = (role, permission) => {
    if (!ROLE_PERMISSIONS[role]) return false;
    return ROLE_PERMISSIONS[role].includes('*') || ROLE_PERMISSIONS[role].includes(permission);
  };
  
  module.exports = { ROLES, ROLE_PERMISSIONS, hasPermission };
