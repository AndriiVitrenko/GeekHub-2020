// libraries
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
// components
import { FormField } from '../FormField';
// interfaces
import { StateInterface } from '../../interfaces';
// actions
import { removeTask, addNewTask, editTask } from '../../actions';
// styles
import {Button} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import './style.css';

export const Organizer: React.FC = () => {
    const {focusedTime, tasks, currentUserKey} = useSelector((state: StateInterface) => state);
    const task = tasks.filter(task => task.time.start <= moment(focusedTime, 'YYYY-MM-DD HH:mm').format('HH:mm') && task.time.end >= moment(focusedTime, 'YYYY-MM-DD HH:mm').format('HH:mm') && moment(task.day, 'YYYY-MM-DD').format('ddd') === moment(focusedTime, 'YYYY-MM-DD HH:mm').format('ddd'))[0]
    const [text, setText] = useState<string>(task ? task.text : '');
    const [startTime, setStartTime] = useState<string>(task ? task.time.start : moment(focusedTime, 'YYYY-MM-DD HH:mm').format('HH:mm'));
    const [endTime, setEndTime] = useState<string>(task ? task.time.end : moment(focusedTime, 'YYYY-MM-DD HH:mm').add(15, 'minute').format("HH:mm") === '00:00' ? '23:59' : moment(focusedTime, 'YYYY-MM-DD HH:mm').add(15, 'minute').format("HH:mm"));
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [color, setColor] = useState<string>((task && task.backgroundColor) ? task.backgroundColor : '#ffffff');
    const dispatch = useDispatch();

    useEffect(() => {
        setText(task ? task.text : '');
        setStartTime(task ? task.time.start : moment(focusedTime, 'YYYY-MM-DD HH:mm').format('HH:mm'));
        setEndTime(task ? task.time.end : moment(focusedTime, 'YYYY-MM-DD HH:mm').add(15, 'minute').format("HH:mm") === '00:00' ? '23:59' : moment(focusedTime, 'YYYY-MM-DD HH:mm').add(15, 'minute').format("HH:mm"));
        setIsEditing(false);
        setColor((task && task.backgroundColor) ? task.backgroundColor : '#ffffff')
    }, [focusedTime, task])

    //--------Handlers-----------

    const textHandler = useCallback((event) => {
        setText(event.target.value)
    }, [])

    const startTimeHandler = useCallback((event) => {
        setStartTime(event.target.value)
    }, [])

    const endTimeHandler = useCallback((event) => {
        setEndTime(event.target.value)
    }, [])

    const clearField = useCallback(() => {
        setText('');
        setStartTime('00:00');
        setEndTime('00:00');
        setColor('#ffffff');
    }, [])

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, [])

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        clearField();
    }, [clearField])

    const colorHandler = useCallback((event) => {
        setColor(event.target.value)
    }, [])

    const removeHandler = useCallback(() => {
        if (task) {
            dispatch(removeTask(currentUserKey, task._id))
            clearField()
        }
    }, [dispatch, currentUserKey, task, clearField])

    const startBlurHandler = useCallback(() => {
        if (startTime > '23:45') {
            setStartTime('23:45')
        }
        else {
            const hours = +startTime.split(':')[0];
            const minutes = +startTime.split(':')[1];

            const newTime = Math.round((hours * 60 + minutes) / 15) * 15;
            const newHours = Math.floor(newTime / 60);
            const newMinutes = newTime - newHours * 60;

            setStartTime(`${newHours < 10 ? '0' + newHours : newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}`)
        }
    }, [startTime])

    const endBlurHandler = useCallback(() => {
        if (endTime > '23:45') {
            setEndTime('23:59')
        }
        else {
            const hours = +endTime.split(':')[0];
            const minutes = +endTime.split(':')[1];

            const newTime = Math.round((hours * 60 + minutes) / 15) * 15;
            const newHours = Math.floor(newTime / 60);
            const newMinutes = newTime - newHours * 60;

            setEndTime(`${newHours < 10 ? '0' + newHours : newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}`)
        }
    }, [endTime])

    const saveHandler = useCallback(() => {
        if (!task) {
            const newTask = {
                _id: '',
                text,
                time: {
                    start: startTime,
                    end: endTime,
                },
                day: moment(focusedTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD'),
                backgroundColor: color,
            }

            const sameDayTasks = tasks.filter(item => moment(focusedTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') === item.day)

            sameDayTasks.forEach(item => {
                if (item.time.start >= newTask.time.start && item.time.start <= newTask.time.end) {
                    newTask.time.end = item.time.start
                }
                else if (item.time.end >= newTask.time.start && item.time.end <= newTask.time.end) {
                    newTask.time.start = item.time.end
                }
            })

            dispatch(addNewTask(
                newTask,
                currentUserKey,
            ))
        }
        else {
            const newTask = {
                ...task,
                text,
                time: {
                    start: startTime,
                    end: endTime,
                },
                backgroundColor: color,
            }

            const sameDayTasks = tasks.filter(item => item._id !== task._id && task.day === item.day)

            sameDayTasks.forEach(item => {
                if (item.time.start >= newTask.time.start && item.time.start <= newTask.time.end) {
                    newTask.time.end = item.time.start;
                }
                else if (item.time.end >= newTask.time.start && item.time.end <= newTask.time.end) {
                    newTask.time.start = item.time.end;
                }
            })

            dispatch(editTask(newTask, currentUserKey, task._id))
        }
        
    }, [dispatch, color, currentUserKey, endTime, focusedTime, startTime, text, task, tasks])

    //------------DOM---------------

    return(
        <div className='organizer'>
            <header>
                Organizer: <strong>{moment(focusedTime, 'YYYY-MM-DD HH:mm').format('HH:mm MMMM DD')}</strong>
                <hr />
            </header>

            <main>
                {task ? <div className="task">
                    <span>
                        {task.text}
                    </span>

                    <Button
                        variant="contained"
                        className="edit"
                        endIcon={<Icon>edit</Icon>}
                        onClick={startEditing}
                        > 
                        Изменить
                    </Button>

                    <Button
                        variant="contained"
                        className="remove"
                        endIcon={<Icon>delete</Icon>}
                        onClick={removeHandler}
                        > 
                        Удалить
                    </Button>
                </div> : <h4>Задач на это время нет...</h4>}
            </main>

            <footer>
                {(isEditing || !task) && <form>
                    <FormField
                        type="text"
                        label="Задание"
                        id="task"
                        required={true}
                        value={text}
                        handler={textHandler}
                    />

                    <FormField
                        className="start_time"
                        type="time"
                        id="start time"
                        label="Время начала"
                        required={true}
                        value={startTime}
                        handler={startTimeHandler}
                        onBlur={startBlurHandler}
                    />

                    <FormField
                        className="end_time"
                        type="time"
                        id="end time"
                        label="Время окончания"
                        required={true}
                        value={endTime}
                        handler={endTimeHandler}
                        onBlur={endBlurHandler}
                    />

                    <FormField
                        className="color"
                        type="color"
                        id="color"
                        label="Цвет фона"
                        required={true}
                        value={color}
                        handler={colorHandler}
                    />

                    <Button
                        variant="contained"
                        color="default"
                        className="cancel"
                        endIcon={<Icon>cancel</Icon>}
                        onClick={cancelEditing}
                        > 
                        Отменить
                    </Button>

                    <Button
                        variant="contained"
                        className="delete"
                        disabled={!text}
                        endIcon={<Icon>clear</Icon>}
                        onClick={clearField}
                        > 
                        Очистить
                    </Button>

                    <Button
                        variant="contained"
                        className="save"
                        endIcon={<Icon>save</Icon>}
                        onClick={saveHandler}
                        > 
                        Сохранить
                    </Button>
                </form>}
            </footer>
        </div>
    )
}