const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);

const port = 8000;
const host = '127.0.0.1';
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

module.exports = io

app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.use('/api', require('./api/api'))

//always return static html for client
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

http.listen(port, host, () => {
    console.log(`Server is listening http://${host}:${port}`)
})