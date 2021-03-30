import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// styles
import './style.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
// actions
import { logIn } from '../../actions';
import { setUser } from '../../redux';
import { checker, patterns } from '../../validation';
// interfaces
import { LogInFormInteface } from '../../interfaces';
// components
import { FormField } from '../FormField'; 

export const Login: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [form, setForm] = useState<LogInFormInteface>({
        email: '',
        password: '',
    })

    useEffect(() => {
        if (form.errors?.email === '' && form.errors?.password === '' && isSubmitted) {
            dispatch(logIn(
                form.email,
                form.password, (key: string) => {
                dispatch(setUser({key}));
                history.push('/')
            }));
        }
    }, [form, dispatch, isSubmitted, history])

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
                email: checker(form.email, patterns.email) === 'incorrect' ? 'Поста неправильна. Проверьте еще раз.' : '',
                password: checker(form.password, patterns.password) === 'incorrect' ? 'Пароль должен состоять из цифр, заглавных и маленьких букв, а так же быть не менне 8 символов длинной.' : '',
            }
        })

        setIsSubmitted(true);
    }, [form])

    return(
        <form className="log-in-form" onSubmit={submitHandler}>
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
                value={form.password}
                handler={fieldChangeHandler}
                type="password"
                id="password"
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