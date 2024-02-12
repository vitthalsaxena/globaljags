// Import packages
const express = require('express');
const path = require('path');
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');

  // Set the port
  const port = 8080;

  // Create instances of necessary packages
  const app = express();

  // Set the identifier for the GCS bucket where the file will be stored

  // Configure an instance of multer

  // Middleware
  app.use('/js', express.static(__dirname + '/public/js'));
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/images', express.static(__dirname + '/public/images'));


// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/upload', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`GlobalJags Web App listening on port ${port}`);
});