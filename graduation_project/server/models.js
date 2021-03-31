const { Schema, model } = require('mongoose');

const schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    tasks: [
        {
            _id: {
                type: String,
                required: true,
            },
            day: {
                type: String,
                required: true,
            },
            time: {
                start: {
                    type: String,
                    required: true,
                },
                end: {
                    type: String,
                    required: true,
                },
            },
            backgroudColor: {
                type: String,
                required: false,
            },
            text: {
                type: String,
                required: true,
            },
        },
    ]
});

module.exports = model('Users', schema);