import React, {PureComponent} from 'react';
import styled from 'styled-components'

const Input = styled.input`
  background: ${props => {
    if (props.valid === undefined) {
      return 'none'
    } else {
      return props.valid ? '#C2E0C6' : '#F9D0C4'
    }
  }
  }
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
            validated: false,
            nameValid: undefined,
            emailValid: undefined,
            passwordValid: undefined,
            phonesValid: []
        }
    }

    submitHandler() {

        let nameValid = nameRule.test(this.state.user.name);
        let emailValid = emailRule.test(this.state.user.email);
        let passwordValid = passwordRule.test(this.state.user.password);
        let phonesValid = [];

        for (let i = 0; i < this.state.user.phones.length; i++) {
            const phone = this.state.user.phones[i];

            if (phone.type === 'home') {
                phonesValid.push(homePhoneRule.test(phone.number))
            }
            else if (phone.type === 'mobile' && (mobilePhoneRule1.test(phone.number) || mobilePhoneRule2.test(phone.number))) {
                phonesValid.push(true)
            }
            else {
                phonesValid.push(false)
            }
        }

        this.setState(
            {
                validated: true,
                nameValid,
                emailValid,
                passwordValid,
                phonesValid,
            }
        )
    }

    fieldChangeHandler(e, fieldName) {
        let user = Object.assign({}, this.state.user)
        user[fieldName] = e.target.value;
        this.setState({user})
    }

    removeNode(event, index) {
        let user = Object.assign({}, this.state.user)
        let phonesValid = Array.from(this.state.phonesValid)
        phonesValid.splice(index, 1)
        user.phones.splice(index, 1)
        this.setState({
            user,
            phonesValid,
        })
    }

    addNode() {
        let user = Object.assign({}, this.state.user)
        user.phones.push({
            number: '',
            type: '',
        })

        this.setState({user})
    }

    phoneChangeHandler(e, i) {
        let user = Object.assign({}, this.state.user)
        user.phones[i].number = e.target.value;
        this.setState({user})
    }

    selectHandler(e, i) {
        let user = Object.assign({}, this.state.user)
        user.phones[i].type = e.target.value;
        this.setState({user})
    }

    render() {
        const phones = this.state.user.phones.map((elem, i) => {
            return (
                <div key={i} className="input-group mb-3">
                    <Input valid={this.state.phonesValid[i]} type="text" className="form-control" value={elem.number || ''} onChange={(e) => {this.phoneChangeHandler(e, i)}}/>
                    <select className="custom-select" defaultValue={elem.type || 'home'} onChange={(e) => {this.selectHandler(e, i)}}>
                        <option value="home">Домашній</option>
                        <option value="mobile">Мобільний</option>
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => {this.removeNode(e, i)}}>Видалити</button>
                    </div>
                </div>
            )
        })

        return (
            <div className="container p-5">
                <form id="user-form" onSubmit={(e) => {e.preventDefault(); this.submitHandler()}}>
                    <div className="form-group">
                        <label>П.І.Б.</label>
                        <Input valid={this.state.nameValid} type="text" name="full_name" className="form-control" id="name" value={this.state.user.name} onChange={(e) => {this.fieldChangeHandler(e, 'name')}}/>
                        <small className="form-text text-muted">Обовʼязково прізвище, імʼя та по батькові. Тільки літерами
                            українскього алфавіту</small>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Input valid={this.state.emailValid} type="text" name="email" className="form-control" id="email" value={this.state.user.email} onChange={(e) => {this.fieldChangeHandler(e, 'email')}}/>
                        <small className="form-text text-muted">Адреса електронної пошти</small>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <Input valid={this.state.passwordValid} type="password" name="password" className="form-control" id="password" value={this.state.user.password} onChange={(e) => {this.fieldChangeHandler(e, 'password')}}/>
                        <small className="form-text text-muted">Мінімум 8 літер. Обовʼязково повинні бути великі та малі
                            літери
                            англійського алфавіту та числа</small>
                    </div>

                    {phones}

                    <div className="add_phone mb-3">
                        <button className="btn" type="button" onClick={() => {this.addNode()}}>Додати номер телефону</button>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}