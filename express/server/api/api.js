//create a router (not another server)
const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');
const io = require('../server');

router.post('/clearCompleted', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            list = list.filter(item => !item.isDone)
            list.forEach((item, index) => item.index = index)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('list:cleared')
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.get('/getList', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)
            res.json({
                list,
            })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.post('/addTodo', (req, res) =>{
    const {text} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            list = list.filter(item => !item.hasOwnProperty('unSaved'))

            list.unshift({
                text,
                index: 0,
                isDone: false,
            })

            list.forEach((item, index) => item.index = index)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('item:added', {
                        text,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.put('/changeItemState', (req, res) => {
    const {index} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list[index].isDone = !list[index].isDone

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('item:changedState', {
                        index,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.post('/deleteItem', (req, res) => {
    const {index} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.splice(index, 1)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('item:deleted', {
                        index,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.post('/changeAllStates', (req, res) => {
    const {state} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.forEach(item => item.isDone = state)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('list:changedAllStates', {
                        state,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.post('/unSavedText', (req, res) => {
    const {text} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            if (text) {
                if (list.some(item => item.unSaved === true)) {
                    list[0].text = text;
                }
                else {
                    list.unshift({
                        unSaved: true,
                        text,
                        isDone: false,
                    })
                }
            }
            else {
                list = list.filter(item => !item.hasOwnProperty('unSaved'))
            }

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('item:unSaved', {
                        text,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

router.put('/editItem', (req, res) => {
    const {index, text} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list[index].text = text;

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => {
                    io.emit('item:edited', {
                        index,
                        text,
                    })
                    res.end()
                })
                .catch(error => {
                    res.status(500).json( {
                        error: error.message,
                    })
                })
        })
        .catch(error => {
            res.status(500).json( {
                error: error.message,
            })
        })
})

//export router
module.exports = router