const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

async function createEditableConvention() {
  try {
    const pdfBytes = await fs.readFile('./templates/Convention_Vierge_PFMP.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Ajoutez ici les champs éditables
    form.createTextField('nom_eleve', { x: 150, y: 520, width: 200, height: 15 });
    form.createTextField('adresse_eleve', { x: 150, y: 500, width: 200, height: 15 });
    // Ajoutez d'autres champs selon les besoins

    const savedpdfBytes = await pdfDoc.save();
    await fs.writeFile('./generated_pdfs/convention_editable.pdf', savedpdfBytes);

    return './generated_pdfs/convention_editable.pdf';
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
}

module.exports = { createEditableConvention };
