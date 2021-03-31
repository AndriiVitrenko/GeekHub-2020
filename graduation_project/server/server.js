const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const port = 8000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
})

app.use('/api', require('./api'));

app.use(express.static(path.resolve(__dirname, '../client/public')));

async function start() {
    try {
        await mongoose.connect('mongodb+srv://andrew:1q2w3e4r@cluster0.p3agv.mongodb.net/users', {
            useNewUrlParser: true,
            useFindAndModify: false,
        })

        app.listen(port)
    }
    catch(e) {
        console.log(e)
    }
}

start()