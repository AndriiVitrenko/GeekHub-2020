const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['PUT', 'GET', 'POST', 'DELETE']
    }
});
const port = 8000;
const host = '127.0.0.1';
const bodyParser = require('body-parser');

//actions
const {
    getList,
    addTodo,
    addUnsavedText,
    changeAllStates,
    deleteItem,
    changeItemState,
    editItem,
    clearCompleted,
} = require('./api/api');

let clients = []

io.on('connection', (socket) => {
    clients.push(socket.id)
    console.log(`Socket ${socket.id} connected`)

    socket.on('message', (message) => {
        const body = JSON.parse(message)
        switch(body.type) {
            case 'get':
                getList()
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result),
                        }))
                    })
                    .catch(error => {
                        socket.emit('error', JSON.stringify({
                            type: 'error',
                            error: new Error('Error while reading file').message,
                        }))
                    })
                break;

            case 'unsaved text':
                addUnsavedText(body.text)
                    .then(result => {
                        socket.broadcast.emit('message', JSON.stringify({
                            type: 'list with unsaved element',
                            list: JSON.parse(result),
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'add todo':
                addTodo(body.text)
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result),
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'change all states':
                changeAllStates(body.state)
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result)
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'delete todo':
                deleteItem(body.index)
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result)
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'change todo state':
                changeItemState(body.index)
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result)
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'edit item':
                editItem(body)
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result)
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            case 'clear completed':
                clearCompleted()
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result),
                        }))
                    })
                    .catch(error => {
                        io.sockets.emit('error', JSON.stringify({
                            type: 'error',
                            error: error.message,
                        }))
                    })
                break;

            default:
                getList()
                    .then(result => {
                        io.sockets.emit('message', JSON.stringify({
                            type: 'list',
                            list: JSON.parse(result),
                        }))
                    })
                    .catch(error => {
                        socket.emit('error', JSON.stringify({
                            type: 'error',
                            error: new Error('Error while reading file').message,
                        }))
                    })
        }
    })

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1)
        console.log(`Socket ${socket.id} connected`)
    })
})

app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '..', 'build')))


//always return static html for client
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

http.listen(port, host, () => {
    console.log(`Server is listening http://${host}:${port}`)
})