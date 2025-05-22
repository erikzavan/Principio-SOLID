// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let entries = []; 

app.post('/api/entries', (req, res) => {
  const entry = req.body;
  if (!entry.name || !entry.message) {
    return res.status(400).json({ error: 'Nome e mensagem são obrigatórios' });
  }

  entries.push(entry);
  res.status(201).send();
});

app.get('/api/entries', (req, res) => {
  res.json(entries);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
