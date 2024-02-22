const mongoose = require('mongoose');
require('dotenv').config;

mongoose.connect("mongodb+srv://test:test@atlascluster.ofvr2jj.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster")

const db = mongoose.connection;

db.on('connected', () => {
    console.log("connexion établie");
})

db.on('error', (err) => {
    console.log(err);
})

process.on('SIGNINT', () => {
    console.log("Deconnexion");
    process.exit(0)
});