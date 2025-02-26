class SignatureService {
    async signDocument(documentId, userId, role) {
      const document = await Document.findById(documentId);
      
      // Vérification des droits
      if (!this.canSign(document, userId, role)) {
        throw new ApiError(403, 'Non autorisé à signer');
      }
  
      // Ajout de la signature
      const signature = await this.createSignature(userId);
      document.signatures.push({
        userId,
        role,
        signature,
        timestamp: new Date()
      });
  
      // Mise à jour du statut
      document.status = this.calculateNewStatus(document);
      
      await document.save();
      
      // Notification
      await this.notifyNextSigner(document);
    }
  }
