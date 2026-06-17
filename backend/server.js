const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

const app = express();

app.use(express.json());

app.use(cors());

dotenv.config();

const upload = multer({ dest: 'uploads/' });

app.get('/api/test', (req, res) => {
  res.send('The server is working.');
});

app.post('/api/analyze', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log("Uploaded file:", req.file);
  res.send("File Uploaded Successfully!");
});

app.listen(3000, () => console.log('Server is running on port 3000'));
