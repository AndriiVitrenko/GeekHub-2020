// libraries
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
// styles
import Icon from '@material-ui/core/Icon';
import './style.css';
// actions
import { changeWeek } from '../../redux';
// interfaces
import { StateInterface } from '../../interfaces';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const rusMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' , 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const Selector: React.FC = () => {
    const dispatch = useDispatch();
    const {startDay, endDay} = useSelector((state: StateInterface) => state);

    const nextWeek = useCallback(() => {
        dispatch(changeWeek({change: 1}))
    }, [dispatch])

    const previoustWeek = useCallback(() => {
        dispatch(changeWeek({change: -1}))
    }, [dispatch])

    return(
        <p className="selector">
            <Icon onClick={previoustWeek}>arrow_left</Icon>

            <span>{rusMonths[months.indexOf(moment(startDay, 'YYYY-MM-DD').format('MMMM'))]} {moment(startDay, 'YYYY-MM-DD').format('DD')} - {rusMonths[months.indexOf(moment(endDay, 'YYYY-MM-DD').format('MMMM'))]} {moment(endDay, 'YYYY-MM-DD').format('DD')}</span>

            <Icon onClick={nextWeek}>arrow_right</Icon>
        </p>
    )
}