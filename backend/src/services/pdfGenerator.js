const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  async generateConvention() {
    try {
      console.log('Début de la génération...');
      
      // Vérifie si le template existe
      const templatePath = path.join(__dirname, '../../templates/Convention_Vierge_PFMP.pdf');
      console.log('Chemin du template:', templatePath);
      
      // Charge le template
      const templateBytes = await fs.readFile(templatePath);
      console.log('Template chargé');
      
      // Charge le PDF
      const pdfDoc = await PDFDocument.load(templateBytes);
      console.log('PDF chargé dans PDFLib');
      
      // Sauvegarde le PDF
      const pdfBytes = await pdfDoc.save();
      console.log('PDF préparé pour la sauvegarde');
      
      // Sauvegarde dans un nouveau fichier
      await fs.writeFile('test-convention.pdf', pdfBytes);
      console.log('PDF sauvegardé');
      
      return pdfBytes;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  }
}

// Test direct
const test = async () => {
  const generator = new PDFGenerator();
  try {
    await generator.generateConvention();
    console.log('Test terminé avec succès !');
  } catch (error) {
    console.error('Erreur durant le test:', error);
  }
};

test();

module.exports = new PDFGenerator();
