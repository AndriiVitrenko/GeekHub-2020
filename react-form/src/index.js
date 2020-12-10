import React from "react";
import ReactDOM from 'react-dom';
import UserForm from './UserForm';

let user = {
    name: 'Тарас Григорович Шевченко',
    email: 'taras@mail.com',
    password: 'Taras123',
    phones: [
        {number: '651122', type: 'home'},
        {number: '0123456789', type: 'mobile'},
        {number: '380123456789', type: 'mobile'},
    ],
}

ReactDOM.render(<UserForm user={user} />, document.getElementById('root'))