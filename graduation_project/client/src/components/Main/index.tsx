// libraries
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
// components
import { Login } from '../Login';
import { Signup } from '../Signup';
import { Home } from '../Home';
// styles
import Alert from '@material-ui/lab/Alert';
import './style.css';
// interfaces
import { StateInterface } from '../../interfaces';

export const Main: React.FC = () => {
    const {error} = useSelector((state: StateInterface) => state);

    return(
        <main className="main">
            {!!error && <Alert severity="error" >{error}</Alert>}
            <Switch>
                <Route exact path="/" >
                    <Home />
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/signup">
                    <Signup />
                </Route>

                <Route path="**">
                    <h1>Страница не найдена. Проверьте правильность URL-пути.</h1>
                </Route>
            </Switch>
        </main>
    )
}