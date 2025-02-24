const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

async function generateConvention(conventionData) {
    try {
        // Charger le template PDF vierge
        const templateBytes = await fs.readFile('./templates/Convention_Vierge_PFMP.pdf');
        const pdfDoc = await PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();

        // Remplir les champs
        form.getTextField('Stagiaire_Nom').setText(conventionData.nom);
        form.getTextField('Stagiaire_Prenom').setText(conventionData.prenom);
        // ... autres champs ...

        // Sauvegarder le PDF
        const pdfBytes = await pdfDoc.save();
        const fileName = `convention_${conventionData.id}.pdf`;
        await fs.writeFile(`./conventions/${fileName}`, pdfBytes);
        
        return fileName;
    } catch (error) {
        console.error('Erreur génération PDF:', error);
        throw error;
    }
}
