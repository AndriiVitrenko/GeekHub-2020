import React, {PureComponent} from 'react';
import $ from 'jquery';

export default class UserForm extends PureComponent {
    state = {
        user: this.props.user
    }

    submitHandler() {

        $('#user-form')[0].classList.add('submitted')

        const userData = this.state.user;
        const nameField = $('input[name=full_name]')[0];
        const emailField = $('input[name=email]')[0];
        const passwordField = $('input[name=password]')[0];

        //---------rules-----------

        const nameRule = /^[а-щіїьюяґє]+\s+[а-щіїьюяґє]+\s+[а-щіїьюяґє]+$/i;
        const emailRule = /^([a-zA-Z0-9-]+[a-zA-Z0-9-.]*[a-zA-Z0-9-]|[a-zA-Z0-9-]+)@[A-Za-z0-9-]+[.]*[A-Za-z0-9-]*\.[A-Za-z0-9-]+$/;
        const passwordRule = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const homePhoneRule = /^[1-9]\d{5}$/;
        const mobilePhoneRule1 = /^[0]\d{9}$/;
        const mobilePhoneRule2 = /^[3]\d{11}$/;

        //----------validating----------------

        nameField.classList.add(nameRule.test(userData.name) ? 'valid' : 'invalid');
        nameField.classList.remove(nameRule.test(userData.name) ? 'invalid' : 'valid');
        emailField.classList.add(emailRule.test(userData.email) ? 'valid': 'invalid');
        emailField.classList.remove(emailRule.test(userData.email) ? 'invalid': 'valid');
        passwordField.classList.add(passwordRule.test(userData.password) ? 'valid': 'invalid');
        passwordField.classList.remove(passwordRule.test(userData.password) ? 'invalid': 'valid');

        for (let i = 0; i < userData.phones.length; i++) {
            if (userData.phones[i].type === 'home') {
                const elem = $(`#${userData.phones[i].number + 1}`)[0]
                elem.classList.remove(homePhoneRule.test(userData.phones[i].number) ? 'invalid' : 'valid');
                elem.classList.add(homePhoneRule.test(userData.phones[i].number) ? 'valid' : 'invalid')

            }
            else if (userData.phones[i].type === 'mobile') {
                const elem = $(`#${userData.phones[i].number + 1}`)[0]
                elem.classList.remove(mobilePhoneRule1.test(userData.phones[i].number) || mobilePhoneRule2.test(userData.phones[i].number) ? 'invalid' : 'valid');
                elem.classList.add(mobilePhoneRule1.test(userData.phones[i].number) || mobilePhoneRule2.test(userData.phones[i].number) ? 'valid' : 'invalid')
            }
            else {
                $(`#${userData.phones[i].number + 1}`)[0].classList.add('invalid')
            }
        }
    }

    fieldChangeHandler(e, fieldName, origin) {
        origin[fieldName] = e.target.value;
        this.setState({user: origin})
    }

    removeNode(event, index, origin) {
        origin.phones.splice(index, 1)
        this.setState({user: origin})

        if($('#user-form').hasClass('submitted')) {
            this.submitHandler()
        }
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
        const user = Object.assign({}, this.state.user);

        const phones = user.phones.map((elem, i) => {
            return (
                <div key={i} className="input-group mb-3">
                    <input id={elem.number + 1} type="text" className="form-control" value={elem.number || ''} onChange={(e) => {this.phoneChangeHandler(e, i, user)}}/>
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
                        <input type="text" name="full_name" className="form-control" id="name" value={user.name} onChange={(e) => {this.fieldChangeHandler(e, 'name', user)}}/>
                        <small className="form-text text-muted">Обовʼязково прізвище, імʼя та по батькові. Тільки літерами
                            українскього алфавіту</small>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" className="form-control" id="email" value={user.email} onChange={(e) => {this.fieldChangeHandler(e, 'email', user)}}/>
                        <small className="form-text text-muted">Адреса електронної пошти</small>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" name="password" className="form-control" id="password" value={user.password} onChange={(e) => {this.fieldChangeHandler(e, 'password', user)}}/>
                        <small className="form-text text-muted">Мінімум 8 літер. Обовʼязково повинні бути великі та малі
                            літери
                            англійського алфавіту та числа</small>
                    </div>

                    {phones}

                    <div className="add_phone mb-3">
                        <button className="btn" type="button" onClick={() => {this.addNode(user)}}>Додати номер телефону</button>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}