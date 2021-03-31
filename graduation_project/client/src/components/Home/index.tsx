// libraries
import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
//components
import { Calendar } from "../Calendar";
import { Organizer } from "../Organizer";
import { Selector } from "../Selector";
// interfaces
import { StateInterface } from '../../interfaces';
// styles
import './style.css';
// actions
import { getTasks } from "../../actions";

export const Home: React.FC = () => {
    const {currentUserKey, focusedTime, tasks} = useSelector((state: StateInterface) => state);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentUserKey) {
            history.push('/login')
        }
        else if (currentUserKey && !tasks.length) {
            dispatch(getTasks(currentUserKey))
        }
    }, [])

    return(
        <div className="container">
            <Selector />
            <Calendar />
            {!!focusedTime && <Organizer />}
        </div>
    )
}