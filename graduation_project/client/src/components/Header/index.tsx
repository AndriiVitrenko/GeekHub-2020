// libraries
import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// styles
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './style.css';
// actions
import { deleteUser } from '../../redux';

export const Header: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const logOutHandler = useCallback(() => {
        dispatch(deleteUser())
    }, [dispatch])

    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className="title">
                    <Link to="/">Ежедневник</Link>
                </Typography>
                {location.pathname.length > 1 && <Button color="inherit"><Link to="/">Главная</Link></Button>}
                <Button color="inherit"><Link to="/signup">Зарегестрироваться</Link></Button>
                <Button color="inherit" onClick={logOutHandler} ><Link to="/login">Выйти</Link></Button>
            </Toolbar>
        </AppBar>
    )
}