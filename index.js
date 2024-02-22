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




// Créer l'objet Express
const app = express();
const router = new express.Router();

// Utilisation du middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Création des instances des classes PdfFacade
const pdfFacade = new PdfFacade();


app.use('/api', router);

app.get('/', (_, res) => {
    res.sendFile(__dirname + '/index.html');
  });


// Route pour générer le rapport de temps
router.post('/generate-pdf', async (req, res) => {
    const { date, first_name, name, date_achat, prix } = req.body;

    const data = await pdfFacade.createDocument()
        .writeTitle('Facture')
        .writeLabelValuePair('Date', date)
        .writeLabelValuePair('Prénom', first_name)
        .writeLabelValuePair('Nom', name)
        .writeLabelValuePair("Date d'achat", date_achat)
        .writeLabelValuePair('Prix', prix)
        .closeAndGetBytes();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
});



// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Lancer le serveur
app.listen(PORT,
    () => {
      console.info("API Listening on port " + PORT);
    }
  );
