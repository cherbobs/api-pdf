const express = require('express')
const PDFDocument = require('pdfkit');
const fs = require('fs');

const FileName = 'facture.pdf';

class PdfFacade {
    createDocument() {
        this.doc = new PDFDocument();
        this.doc.pipe(fs.createWriteStream(FileName)); 
        return this;
    }
 
    writeTitle(title) {
        this.doc.font('Helvetica-Bold');
        this.doc.text(title, { align: 'center' });
        this.doc.font('Helvetica');
        return this;
    }
 
    writeLabelValuePair(label, value) {
        this.doc.text(`${label} : `, { continued: true });
        this.doc.font('Helvetica');
        this.doc.text(value);
        return this;
    }
 
    closeAndGetBytes() {
        return new Promise((resolve, reject) => {
            try {
                this.doc.end();
                setTimeout(() => {
                    resolve(fs.readFileSync(FileName))
                }, 250);
            } catch (err) {
                reject(err);
            }
        });
    }   
}

class ReportService {
    generateTimeReport() {
        return new Promise((resolve, reject) => {
            resolve({ ok: true });
        });
    }
}


// Créer l'objet Express
const app = express();
const router = new express.Router();



app.use('/api', router);

// Création des instances des classes PdfFacade et ReportService
const pdfFacade = new PdfFacade();
const reportGenerator = new ReportService();


// Route pour générer le rapport de temps
router.get('/TimeReport', async (req, res) => {
    const data = await pdfFacade.createDocument()
        .writeTitle('Ceci est un test')
        .writeLabelValuePair('Date', new Date().toISOString())
        .writeLabelValuePair('Valid', true)
        .closeAndGetBytes();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
});


app.get('/', (_, res) => {
    res.send('Hello, this is your root route!');
  });



// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Lancer le serveur
app.listen(PORT,
    () => {
      console.info("API Listening on port " + PORT);
    }
  );
