const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const cfg = require('./config');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory sqlite for demo
const db = new sqlite3.Database(':memory:');
const initSql = fs.readFileSync('./db-init.sql', 'utf8');
db.exec(initSql);

// --- Vulnerable login: plaintext comparison + hardcoded secret usage
app.post('/login', (req, res) => {
  const { user, pass } = req.body;
  // insecure: plaintext password check via direct query building
  db.get("SELECT * FROM users WHERE username = '" + user + "' AND password = '" + pass + "'", (err, row) => {
    if (err) return res.status(500).send('db error');
    if (row) {
      // exposing secret in response (bad practice)
      res.json({ message: 'ok', token: cfg.JWT_SECRET });
    } else {
      res.status(401).json({ message: 'bad creds' });
    }
  });
});

// --- SQL injection example via search param (string concat)
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  // vulnerable: direct interpolation into SQL
  const sql = "SELECT * FROM users WHERE username LIKE '%" + q + "%'";
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).send('db error');
    res.json(rows);
  });
});

// --- Command injection example
app.post('/run', (req, res) => {
  const cmd = req.body.cmd || 'echo nothing';
  // vulnerable: exec with unsanitized user input
  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).send('error running command');
    res.json({ out: stdout, err: stderr });
  });
});

// --- File upload that writes to disk under user-provided name (path traversal)
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  const filename = req.body.name || req.file.originalname;
  // insecure: allow user-provided filename (could contain ../)
  const target = 'uploads/' + filename;
  fs.rename(req.file.path, target, (err) => {
    if (err) return res.status(500).send('upload failed');
    res.json({ path: target });
  });
});

app.listen(3000, () => console.log('vuln server listening on 3000'));
