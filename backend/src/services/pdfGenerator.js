const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  async generateConvention() {
    try {
      console.log('Début de la génération...');
      
      const templatePath = path.join(__dirname, '../../templates/Convention_Vierge_PFMP.pdf');
      console.log('Chemin du template:', templatePath);
      
      const templateBytes = await fs.readFile(templatePath);
      console.log('Template chargé');
      
      const pdfDoc = await PDFDocument.load(templateBytes);
      console.log('PDF chargé dans PDFLib');
      
      const pdfBytes = await pdfDoc.save();
      console.log('PDF préparé pour la sauvegarde');
      
      await fs.writeFile('test-convention.pdf', pdfBytes);
      console.log('PDF sauvegardé');
      
      return pdfBytes;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  }
}

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
