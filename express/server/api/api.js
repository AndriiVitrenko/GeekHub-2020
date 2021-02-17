//create a router (not another server)
const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

//get all todos
router.get("/all", (req, res) => {
    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)
            res.json({
                list,
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error'
            })
        })
});

//add todo
router.post('/addTodo', (req, res) => {
    const {text} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.unshift({
                text: text || '',
                index: 0,
                isDone: false,
            })
            list.forEach((item, i) => item.index = i)

            const newList = JSON.stringify(list)
            fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => res.json({
                    message: 'OK'
                }))
                .catch(error => {
                    res.status(500).json({
                        message: 'Server error',
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error'
            })
        })
})

router.put('/changeItemState', (req, res) => {

    const {index} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list[index].isDone = !list[index].isDone;

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => res.json({message: 'OK'}))
                .catch(error => {
                    res.status(500).json({
                        message: 'Server error',
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error',
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
                .then(() => res.json({message: 'OK'}))
                .catch(error => {
                    res.status(500).json({
                        message: 'Server error',
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error',
            })
        })
})

router.delete('/deleteItem', (req, res) => {
    const {index} = req.body;

    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.splice(index, 1)
            list.forEach((item, index) => item.index = index)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => res.json({message: 'OK'}))
                .catch(error => {
                    res.status(500).json({
                        message: 'Server error',
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error',
            })
        })
})

router.post('/clearCompleted', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            list = list.filter(item => !item.isDone)
            list.forEach((item, index) => item.index = index)

            fs.writeFile(path.resolve(__dirname, '../todo.json'), JSON.stringify(list))
                .then(() => res.json({message: 'OK'}))
                .catch(error => {
                    res.status(500).json({
                        message: 'Server error',
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Server error',
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
                   .then(() => res.json({message: 'OK'}))
                   .catch(error => {
                       res.status(500).json({
                           message: 'Server error',
                       })
                   })
           })
           .catch(error => {
               res.status(500).json({
                   message: 'Server error',
               })
           })
})

//export router
module.exports = router;