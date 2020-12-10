import React, {PureComponent, Component} from 'react';
import $ from 'jquery';
import ReactDom from 'react-dom';

export default class UserForm extends PureComponent {
    state = {
        user: {
            name: 'Тарас Григорович Шевченко',
            email: 'taras@mail.com',
            password: 'Taras123',
            phones: [
                {number: '651122', type: 'home'},
                {number: '0123456789', type: 'mobile'},
                {number: '380123456789', type: 'mobile'},
            ]
        }
    };

    submitHandler() {
        //---------fields-----------------

        const nameField = $('#name');
        const emailField = $('#email');
        const passwordField = $('#password');
        const phonesGroup = $('.input-group');

        //---------rules-----------

        const nameRule = /^[а-щіїьюяґє]+\s+[а-щіїьюяґє]+\s+[а-щіїьюяґє]+$/i;
        const emailRule = /^([a-zA-Z0-9-]+[a-zA-Z0-9-.]*[a-zA-Z0-9-]|[a-zA-Z0-9-]+)@[A-Za-z0-9-]+[.]*[A-Za-z0-9-]*\.[A-Za-z0-9-]+$/;
        const passwordRule = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const homePhoneRule = /^[1-9]\d{5}$/;
        const mobilePhoneRule1 = /^0\d{9}$/;
        const mobilePhoneRule2 = /^3\d{11}$/;

        //---------object with user data------------

        const user = {
            name: nameField[0].value,
            email: emailField[0].value,
            password: passwordField[0].value,
            phones: []
        }

        for (let i = 0; i < phonesGroup.length; i++) {
            let number = phonesGroup[i].childNodes[0].value.trim();
            let type = phonesGroup[i].childNodes[1].value;

            user.phones.push({number, type})
        }

        //----------validating----------------

        nameField.css('background', nameRule.test(user.name) ? '#C2E0C6' : '#F9D0C4');
        emailField.css('background', emailRule.test(user.email) ? '#C2E0C6': '#F9D0C4');
        passwordField.css('background', passwordRule.test(user.password) ? '#C2E0C6': '#F9D0C4');

        for (let i = 0; i < user.phones.length; i++) {
            if (user.phones[i].type === 'home') {
                phonesGroup[i].childNodes[0].style.background = homePhoneRule.test(user.phones[i].number) ? '#c2e0c6' : '#F9D0C4'
            }
            else if (user.phones[i].type === 'mobile') {
                if (mobilePhoneRule1.test(user.phones[i].number) || mobilePhoneRule2.test(user.phones[i].number)) {
                    phonesGroup[i].childNodes[0].style.background = '#C2E0C6'
                }
                else {
                    phonesGroup[i].childNodes[0].style.background = '#F9D0C4'
                }
            }
        }
    }

    removeNode(event, index, origin) {
        origin.phones.splice(index, 1)
        this.setState({user: origin})
    }

    addNode(origin) {
        origin.phones.push({
            number: '',
            type: '',
        })

        this.setState({user: origin})
    }

    phoneChangeHandler(e, i, origin) {
        origin.phones[i].number = e.target.value;
        this.setState({user: origin})
    }

    selectHandler(e, i, origin) {
        origin.phones[i].type = e.target.value;
        this.setState({user: origin})
    }

    render() {
        const {user} = this.state;
        console.log(this.state)

        const phones = user.phones.map((elem, i) => {
            return (
                <div key={i} className="input-group mb-3">
                    <input type="text" className="form-control" defaultValue={elem.number} onChange={(e) => {this.phoneChangeHandler(e, i, user)}}/>
                    <select className="custom-select" defaultValue={elem.type || 'home'} onChange={(e) => {this.selectHandler(e, i, user)}}>
                        <option value="home">Домашній</option>
                        <option value="mobile">Мобільний</option>
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => {this.removeNode(e, i, user)}}>Видалити</button>
                    </div>
                </div>
            )
        })

        return (
            <div className="container p-5">
                <form id="user-form" onSubmit={(e) => {e.preventDefault();this.submitHandler()}}>
                    <div className="form-group">
                        <label>П.І.Б.</label>
                        <input type="text" name="full_name" className="form-control" id="name" defaultValue={user.name}/>
                        <small className="form-text text-muted">Обовʼязково прізвище, імʼя та по батькові. Тільки літерами
                            українскього алфавіту</small>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" className="form-control" id="email" defaultValue={user.email}/>
                        <small className="form-text text-muted">Адреса електронної пошти</small>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" name="password" className="form-control" id="password" defaultValue={user.password}/>
                        <small className="form-text text-muted">Мінімум 8 літер. Обовʼязково повинні бути великі та малі
                            літери
                            англійського алфавіту та числа</small>
                    </div>

                    {phones}

                    <div className="form-group" id="user-phones">

                    </div>

                    <div className="add_phone mb-3">
                        <button className="btn" type="button" onClick={() => {user.phones.push({number: '', type: ''}); this.setState({user: user})}}>Додати номер телефону</button>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }

    /*state = {
        count: 0
    };

    render() {
        const { count } = this.state;

        return (
            <div className="App">
                <h1>{count}</h1>
                <button onClick={() => this.setState({ count: count + 1 })}>
                    Increase counter
                </button>
                <p>{this.props.info}</p>
            </div>
        );
    }*/
}