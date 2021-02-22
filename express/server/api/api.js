//create a router (not another server)
const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

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

const getList = () => {
     return fs.readFile(path.resolve(__dirname, '../todo.json'))
 }

const addTodo = (text) => {
     return fs.readFile(path.resolve(__dirname, '../todo.json'))
         .then(result => {
             let list = JSON.parse(result)

             list = list.filter(item => !item.hasOwnProperty('unSaved'))

             list.unshift({
                 text: text || '',
                 index: 0,
                 isDone: false,
             })
             list.forEach((item, i) => item.index = i)

             const newList = JSON.stringify(list)
             return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                 .then(() => {
                     return newList
                 })
                 .catch(error => {
                     throw new Error('Error while writing file')
                 })
         })
 }

const addUnsavedText = (text) => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            if (text) {
                if (!list.some(elem => elem.hasOwnProperty('unSaved'))) {
                    list.unshift({
                        text,
                        isDone: false,
                        unSaved: true,
                    })
                }
                else {
                    list.filter(elem => elem.hasOwnProperty('unSaved'))[0].text = text
                }
            }
            else {
                list = list.filter(elem => !elem.hasOwnProperty('unSaved'))
            }

            const newList = JSON.stringify(list)
            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

const changeAllStates = (state) => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.forEach(item => !item.hasOwnProperty('unSaved')? item.isDone = state : item.isDone = false)

            const newList = JSON.stringify(list)

            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

const deleteItem = (index) => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list.splice(index, 1)
            list.forEach((item, index) => item.index = index)

            const newList = JSON.stringify(list)

            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

const changeItemState = (index) => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list[index].isDone = !list[index].isDone

            const newList = JSON.stringify(list)

            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

const editItem = ({index, text}) => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            const list = JSON.parse(result)

            list[index].text = text

            const newList = JSON.stringify(list)

            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

 const clearCompleted = () => {
    return fs.readFile(path.resolve(__dirname, '../todo.json'))
        .then(result => {
            let list = JSON.parse(result)

            list = list.filter(item => !item.isDone)

            const newList = JSON.stringify(list)

            return fs.writeFile(path.resolve(__dirname, '../todo.json'), newList)
                .then(() => {
                    return newList
                })
                .catch(error => {
                    throw new Error('Error while writing file')
                })
        })
 }

//export router
module.exports = {
    getList,
    addTodo,
    addUnsavedText,
    changeAllStates,
    deleteItem,
    changeItemState,
    editItem,
    clearCompleted,
};