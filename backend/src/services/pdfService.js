class PdfService {
    async generateConvention(data) {
      const doc = await PDFDocument.load(templateBytes);
      
      // Ajout de metadata
      doc.setTitle(`Convention - ${data.student.name}`);
      doc.setAuthor('Application de Gestion des Conventions');
      
      // Ajout de watermark si brouillon
      if (data.status === 'DRAFT') {
        await this.addWatermark(doc, 'BROUILLON');
      }
      
      // Remplissage des champs
      await this.fillFormFields(doc, data);
      
      // Ajout des signatures existantes
      await this.addSignatures(doc, data.signatures);
      
      return await doc.save();
    }
  }
