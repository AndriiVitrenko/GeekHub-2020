const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const api = require('./api/api');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.use('/api', api)

//always return static html for client
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(port)