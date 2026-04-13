const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app        = express();
const PORT       = process.env.PORT || 3000;
const VOTES_FILE = path.join(__dirname, 'votes.json');

app.use(cors({
  origin: [
    'https://revelacion-ayg.netlify.app',
    'http://localhost',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ]
}));
app.use(express.json());

function getVotes() {
  try {
    return JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8'));
  } catch {
    return { varon: 0, mujer: 0 };
  }
}

function saveVotes(votes) {
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes));
}

// GET /votes → devuelve conteo actual
app.get('/votes', (req, res) => {
  res.json(getVotes());
});

// POST /vote → body: { gender: 'varon' | 'mujer' }
app.post('/vote', (req, res) => {
  const { gender } = req.body;
  if (gender !== 'varon' && gender !== 'mujer') {
    return res.status(400).json({ error: 'Género inválido' });
  }
  const votes = getVotes();
  votes[gender]++;
  saveVotes(votes);
  res.json(votes);
});

app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});
