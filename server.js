// server stuff
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.js'));
});

const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running'));