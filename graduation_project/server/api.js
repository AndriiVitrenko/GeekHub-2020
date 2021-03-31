const router = require('express').Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Users = require('./models');

const serverErrorMessage = 'Произошла ошибка на сервере. Перезагрузите страницу и попробуйте снова.';

router.post('/getTasks', (req, res) => {
    const {userId} = req.body;
    Users.findById(userId)
        .then(result => {
            if (result) {
                const user = result;

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
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    Users.find({email})
        .then(async result => {
            if (result.length) {
                const user = result[0];

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
            else {
                res.status(404).json({
                    message: 'Пользователь не найден. Проверьте почту.'
                })
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
    Users.find({email})
        .then(async result => {
            if (result.length) {
                res.status(403).json({
                    message: 'Этот пользователь уже зарегистирован.'
                })

                return;
            }
            else {
                const newUser = new Users({
                    _id: crypto.randomBytes(20).toString('hex'),
                    email, 
                    password: await bcrypt.hash(password, await bcrypt.genSalt()),
                    name, 
                    surname,
                    tasks: [],
                    phone: phone || '',
                })

                newUser.save()
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
            }
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })          
})

router.post('/addTask', (req, res) => {
    const {task, userId} = req.body;
    Users.findById(userId)
        .then(result => {
            if (result) {
                task._id = crypto.randomBytes(10).toString('hex');
                result.tasks.push(task)

                result.save()
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
            }
            else {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.',
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.post('/deleteTask', (req, res) => {
    const {userId, taskId} = req.body;
    Users.findById(userId)
        .then(result => {
            if (result) {
                result.tasks = result.tasks.filter(task => task._id !== taskId);

                result.save()
                    .then(() => {
                        res.json({})
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: serverErrorMessage,
                        })
                    })
            }
            else {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

router.put('/editTask', (req, res) => {
    const {newTask, userId, taskId} = req.body;

    Users.findById(userId)
        .then(result => {
            if (result) {
                const index = result.tasks.indexOf(result.tasks.filter(task => task._id === taskId)[0])

                result.tasks[index] = newTask;

                result.save()
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
            }
            else {
                res.status(404).json({
                    message: 'Пользователь не найден. Попробуйте войти в систему еще раз.',
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: serverErrorMessage,
            })
        })
})

module.exports = router