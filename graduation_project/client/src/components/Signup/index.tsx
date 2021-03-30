// libraries
import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// interfaces
import { SignUpFormInterface } from '../../interfaces';
// components
import { FormField } from '../FormField';
// actions
import { signUp } from '../../actions';
import { setUser } from '../../redux';
import { checker, patterns } from '../../validation';
// styles
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import './style.css';

export const Signup: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState<SignUpFormInterface>({
        email: '',
        password: '',
        name: '',
        surname: '',
        phone: '',
        repeatedPassword: '',
    })

    useEffect(() => {
            if (form.errors?.email === '' &&
                form.errors?.password === '' &&
                form.errors?.name === '' &&
                form.errors?.surname === '' &&
                (form.errors?.phone === '' || form.phone === '') && isSubmitted) {
                    dispatch(signUp({
                        email: form.email,
                        password: form.password,
                        phone: form.phone,
                        name: form.name,
                        surname: form.surname,
                    }, (key: string) => {
                        dispatch(setUser({key}))
                        history.push('/')
                    }));
        }
            
    }, [form, isSubmitted, dispatch, history])

    const fieldChangeHandler = useCallback((event) => {
        setIsSubmitted(false);
        setForm({
            ...form,
            [event.target.id]: event.target.value.trim(),
        })
    }, [form])

    const submitHandler = useCallback((e) => {
        e.preventDefault();

        setForm({
            ...form,
            errors: {
                email: checker(form.email, patterns.email) === 'incorrect' ? 'Почта не корректна. Проверьте еще раз.' : '',
                password: form.repeatedPassword === form.password ? checker(form.password, patterns.password) === 'incorrect' ? 'Пароль должен состоять из цифр, заглавных и маленьких букв, а так же быть не менне 8 символов длинной.' : '' : 'Пароль и повторенный пароль не совпадают.',
                name: checker(form.name, patterns.name) === 'incorrect' ? 'Имя должно состоять из украинских или русских букв.' : '',
                surname: checker(form.surname, patterns.name) === 'incorrect' ? 'Фамилия должна состоять из украинских или русских букв.' : '',
                phone: checker(form.phone, patterns.phone) === 'incorrect' ? 'Номер телефона должен начинатся с "+" и состоять из 6-15 цифр.' : '',
            }
        })
        setIsSubmitted(true);

    }, [form])

    return(
        <form className="sign-up-form" onSubmit={submitHandler}>
            <FormField 
                required={true} 
                error={form.errors?.name} 
                handler={fieldChangeHandler} 
                value={form.name} 
                label="Имя" 
                type="text"
                id="name"
            />

            <FormField 
                required={true} 
                error={form.errors?.surname} 
                handler={fieldChangeHandler} 
                value={form.surname} 
                label="Фамилия"
                type="text"
                id="surname"
            />

            <FormField 
                required={false}
                error={form.errors?.phone}
                label="Телефон"
                value={form.phone}
                handler={fieldChangeHandler}
                type="tel"
                id="phone"
            />

            <FormField 
                required={true}
                error={form.errors?.email}
                label="Почта"
                value={form.email}
                handler={fieldChangeHandler}
                type="email"
                id="email"
            />

            <FormField 
                required={true}
                error={form.errors?.password}
                label="Пароль"
                id="password"
                value={form.password}
                handler={fieldChangeHandler}
                type="password"
            />

            <FormField 
                required={true}
                error={''}
                label="Повторите пароль"
                value={form.repeatedPassword}
                handler={fieldChangeHandler}
                type="password"
                id="repeatedPassword"
            />

            <Button
                variant="contained"
                color="primary"
                endIcon={<Icon>send</Icon>}
                type="submit"> 
                Send
            </Button>
        </form>
    )
}