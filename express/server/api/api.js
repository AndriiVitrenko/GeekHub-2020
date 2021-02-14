//create a router (not another server)
const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

//get all todos
router.get("/all", (req, res) => {
    try {
        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => res.status(200).json({
                list,
            }))

    } catch (err) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

//add todo
router.post('/addTodo', (req, res) => {
    try {
        const {text} = req.body;

        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => {
                list.unshift({
                    text: text || '',
                    index: 0,
                    isDone: false,
                })
                list.map((item, i) => item.index = i)

                const newList = JSON.stringify(list)
                fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                    .then(() => res.status(200).json({
                        message: 'OK'
                    }))
            })
    }
    catch (error) {
       res.status(500).json({
           message: 'Server error'
       })
    }
})

router.put('/changeItemState', (req, res) => {
    try {
        const {index} = req.body;

        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => {
                list[index].isDone = !list[index].isDone;

                fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                    .then(() => res.status(200).json({message: 'OK'}))
            })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error',
        })
    }
})

router.post('/changeAllStates', (req, res) => {
    try {
        const {state} = req.body;

        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => {
                list.map(item => item.isDone = state)

                fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                    .then(() => res.status(200).json({message: 'OK'}))
            })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error',
        })
    }
})

router.delete('/deleteItem', (req, res) => {
    try {
        const {index} = req.body;

        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => {
                list.splice(index, 1)
                list.map((item, index) => item.index = index)

                fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                    .then(() => res.status(200).json({message: 'OK'}))
            })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error',
        })
    }
})

router.post('/clearCompleted', (req, res) => {
    try {
        fs.readFile(path.resolve(__dirname, '../todo.json'))
            .then(result => JSON.parse(result))
            .then(list => {
                list = list.filter(item => !item.isDone)
                list.map((item, index) => item.index = index)

                fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                    .then(() => res.status(200).json({message: 'OK'}))
            })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error',
        })
    }
})

router.put('/editItem', (req, res) => {
    try {
       const {index, text} = req.body;

       fs.readFile(path.resolve(__dirname, '../todo.json'))
           .then(result => JSON.parse(result))
           .then(list => {
               list[index].text = text;

               fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                   .then(() => res.status(200).json({message: 'OK'}))
           })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error',
        })
    }
})

//export router
module.exports = router;