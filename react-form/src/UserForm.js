import React, {PureComponent} from 'react';
import styled from 'styled-components'

const Input = styled.input`
  background: ${props => props.valid ? '#C2E0C6' : '#F9D0C4'};
`;

const nameRule = /^[а-щіїьюяґє]+\s+[а-щіїьюяґє]+\s+[а-щіїьюяґє]+$/i;
const emailRule = /^([a-zA-Z0-9-]+[a-zA-Z0-9-.]*[a-zA-Z0-9-]|[a-zA-Z0-9-]+)@[A-Za-z0-9-]+[.]*[A-Za-z0-9-]*\.[A-Za-z0-9-]+$/;
const passwordRule = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const homePhoneRule = /^[1-9]\d{5}$/;
const mobilePhoneRule1 = /^[0]\d{9}$/;
const mobilePhoneRule2 = /^[3]\d{11}$/;

export default class UserForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            nameValid: nameRule.test(this.props.user.name),
            emailValid: emailRule.test(this.props.user.email),
            passwordValid: passwordRule.test(this.props.user.password),
            phonesValid: [
                true,
                true,
                true,
            ]
        }
    }


    submitHandler(e) {
        e.preventDefault()

        const userData = Object.assign({}, this.state)

        userData.nameValid = nameRule.test(userData.user.name);
        userData.emailValid = emailRule.test(userData.user.email);
        userData.passwordValid = passwordRule.test(userData.user.password);
        userData.phonesValid = [];

        for (let i = 0; i < userData.user.phones.length; i++) {
            const phone = userData.user.phones[i];

            if (phone.type === 'home') {
                userData.phonesValid.push(homePhoneRule.test(phone.number))
            }
            else if (phone.type === 'mobile' && (mobilePhoneRule1.test(phone.number) || mobilePhoneRule2.test(phone.number))) {
                userData.phonesValid.push(true)
            }
            else {
                userData.phonesValid.push(false)
            }
        }

        this.setState(userData)
    }

    fieldChangeHandler(e, fieldName, origin) {
        origin[fieldName] = e.target.value;
        this.setState({user: origin})
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
        const user = Object.assign({}, this.state.user);

        const phones = user.phones.map((elem, i) => {
            return (
                <div key={i} className="input-group mb-3">
                    <Input valid={this.state.phonesValid[i]} type="text" className="form-control" value={elem.number || ''} onChange={(e) => {this.phoneChangeHandler(e, i, user)}}/>
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
                <form id="user-form" onSubmit={(e) => {this.submitHandler(e)}}>
                    <div className="form-group">
                        <label>П.І.Б.</label>
                        <Input valid={this.state.nameValid} type="text" name="full_name" className="form-control" id="name" value={user.name} onChange={(e) => {this.fieldChangeHandler(e, 'name', user)}}/>
                        <small className="form-text text-muted">Обовʼязково прізвище, імʼя та по батькові. Тільки літерами
                            українскього алфавіту</small>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Input valid={this.state.emailValid} type="text" name="email" className="form-control" id="email" value={user.email} onChange={(e) => {this.fieldChangeHandler(e, 'email', user)}}/>
                        <small className="form-text text-muted">Адреса електронної пошти</small>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <Input valid={this.state.passwordValid} type="password" name="password" className="form-control" id="password" value={user.password} onChange={(e) => {this.fieldChangeHandler(e, 'password', user)}}/>
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