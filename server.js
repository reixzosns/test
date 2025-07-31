const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const LOG_FILE = path.join(__dirname, 'logs.json');

app.use(express.static('public'));
app.use('/admin', express.static('admin'));

app.use(express.json());

app.post('/log', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();

  const logEntry = { ip, userAgent, timestamp };

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    const logs = err ? [] : JSON.parse(data || '[]');
    logs.push(logEntry);
    fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), () => {});
  });

  res.sendStatus(200);
});

app.get('/logs', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    res.json(err ? [] : JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Visitor IP Tracker running on http://localhost:${PORT}`);
});
