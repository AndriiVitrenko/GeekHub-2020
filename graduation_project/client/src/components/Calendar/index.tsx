// libraries
import React, { useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
// interfaces
import { StateInterface } from '../../interfaces';
// actions
import { setFocus } from '../../redux';
// components
import { TaskComponent } from '../TaskComponent';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const rusDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const timeCells = new Array(95)
    .fill(0)
    .map((item, i) => {
        const quaters = (i + 1) * 15;
        const hours = Math.floor(quaters / 60)
        const minutes = quaters - hours * 60;

        const time = (hours < 10 ? `0${hours}` : `${hours}`) + ':' + (minutes === 0 ? `00` : `${minutes}`)

        return {
            time
        }
    })

const timeDifference = (start: string, end: string) => {
    const startTime = {
        hours: +start.split(':')[0],
        minutes: +start.split(':')[1],
    }

    const endTime = {
        hours: +end.split(':')[0],
        minutes: +end.split(':')[1],
    }

    return (endTime.hours - startTime.hours) * 60 + endTime.minutes - startTime.minutes;
}

export const Calendar: React.FC = () => {
    const {tasks, startDay, endDay} = useSelector((state: StateInterface) => state);
    const dispatch = useDispatch();

    const focusHandler = useCallback((event) => {
        dispatch(setFocus({focus: event.currentTarget.getAttribute('data-time')}))
    }, [dispatch])  

    return(
        <>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            {days.map((day, i) => {
                                return <th key={i} title={rusDays[i] + ' ' + moment(startDay, 'YYYY-MM-DD').add(i, 'day').format('DD')} >{rusDays[i]}</th>
                            })}    
                        </tr>    
                    </thead>   

                    <tbody>
                        {
                            timeCells.map((item, i) => {
                                const taskArray = tasks.filter(task => task.time.start <= item.time && task.time.end >= item.time && moment(task.day, 'YYYY-MM-DD').isBetween(startDay, endDay, undefined, '[]'));
                        

                                return <tr key={i}>
                                    <td className="time-cell">{item.time}</td>

                                    {days.map((day, j) => {
                                        const task = taskArray.filter(task => moment(task.day, 'YYYY-MM-DD').format('ddd') === day && item.time >= task.time.start && item.time < task.time.end)[0];
                                        const taskDuration = task ? timeDifference(task.time.start, task.time.end) : 0;
                                        const cellTime = moment(startDay, 'YYYY-MM-DD').add(j, 'day').format('YYYY-MM-DD') + ' ' + item.time;
                                        const rowSpan = taskDuration / 15 || 1;

                                        if (task && item.time === task.time.start) {
                                            return <td data-time={cellTime}  
                                                    rowSpan={rowSpan} 
                                                    key={j} 
                                                    onClick={focusHandler}
                                                    >
                                                        <TaskComponent task={task} />
                                                </td>
                                        }
                                        else if (task && item.time > task.time.start && item.time < task.time.end) {
                                            return <Fragment key={j}></Fragment>
                                        }               
                                        else {
                                            return <td onClick={focusHandler} data-time={cellTime} key={j} ><div className="text-cell"></div></td>
                                        }                         
                                    })}
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}