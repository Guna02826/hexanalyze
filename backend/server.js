const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

app.use(express.json());

app.use(cors());

dotenv.config();

app.get('/api/test', (req, res) => {
  res.send('The server is working.');
});

app.listen(3000, () => console.log('Server is running on port 3000'));
