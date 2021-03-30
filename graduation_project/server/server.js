const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
})

app.use('/api', require('./api'));

app.use(express.static(path.resolve(__dirname, '../client/public')));

app.listen(port)