const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const serverErrorMessage = 'Произошла ошибка на сервере. Перезагрузите страницу и попробуйте снова.';

router.post('/getTasks', (req, res) => {
    const {userId} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then((result) => {
            const userBase = JSON.parse(result).users;

            const user = userBase.filter(user => user._id === userId)[0];

            if (user) {
                res.json({
                    tasks: user.tasks,
                })
            }
            else {
                res.status(404).json({
                    message: 'Пользователь не найден.'
                })
            }            
        })
        .catch(error => res.status(500).json({
            message: serverErrorMessage,
        }))
})

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then(async result => {
            const userBase = JSON.parse(result).users;
            
            const user = userBase.filter(user => user.email === email)[0];

            if (!user) {
                res.status(404).json({
                    message: 'Пользователь не найден. Проверьте почту.'
                })
            }
            else {
                if (await bcrypt.compare(password, user.password)) {
                    res.json({
                        tasks: user.tasks,
                        key: user._id,
                    })
                }
                else {
                    res.status(404).json({
                        message: 'Пароль неправильный.',
                    })
                }
            }
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.post('/signup', (req, res) => {
    const {name, surname, phone, email, password} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then(async result => {
            const userBase = JSON.parse(result).users;

            if (userBase.some(user => user.email === email)) {
                res.status(403).json({
                    message: 'Этот пользователь уже зарегистирован.'
                })

                return;
            }

            const newUser = {
                _id: crypto.randomBytes(20).toString('hex'),
                email, 
                password: await bcrypt.hash(password, await bcrypt.genSalt()),
                name, 
                surname,
                tasks: [],
            }

            if (phone) {
                newUser.phone = phone;
            }

            userBase.push(newUser)

            fs.writeFile(path.resolve(__dirname, './dataBase.json'), JSON.stringify({ users: userBase}))
                .then(() => {
                    res.json({
                        key: newUser._id,
                        tasks: newUser.tasks,
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        message: serverErrorMessage,
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.post('/addTask', (req, res) => {
    const {task, userId} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then(result => {
            const userBase = JSON.parse(result).users;

            const user = userBase.filter(user => user._id === userId)[0];

            if (!user) {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.',
                })

                return;
            }

            task._id = crypto.randomBytes(10).toString('hex');

            user.tasks.push(task);

            fs.writeFile(path.resolve(__dirname, './dataBase.json'), JSON.stringify({users: userBase}))
                .then(() => {
                    res.json({
                        taskId: task._id,
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        message: serverErrorMessage,
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.post('/deleteTask', (req, res) => {
    const {userId, taskId} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then(result => {
            const userBase = JSON.parse(result).users;

            const user = userBase.filter(user => user._id === userId)[0];

            if (!user) {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.',
                })

                return;
            }

            user.tasks = user.tasks.filter(task => task._id !== taskId);

            fs.writeFile(path.resolve(__dirname, './dataBase.json'), JSON.stringify({users: userBase}))
                .then(() => {
                    res.json({})
                })
                .catch(error => {
                    res.status(500).json({
                        message: serverErrorMessage,
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.put('/editTask', (req, res) => {
    const {newTask, userId, taskId} = req.body;

    fs.readFile(path.resolve(__dirname, './dataBase.json'))
        .then(result => {
            const userBase = JSON.parse(result).users;

            const user = userBase.filter(user => user._id === userId)[0];

            if (!user) {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.',
                })
                return;
            }
            
            const index = user.tasks.indexOf(user.tasks.filter(task => task._id === taskId)[0]);

            user.tasks[index] = newTask;

            fs.writeFile(path.resolve(__dirname, './dataBase.json'), JSON.stringify({users: userBase}))
                .then(() => {
                    res.json({
                        index,
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        message: serverErrorMessage,
                    })
                })
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

module.exports = router