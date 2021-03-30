// libraries
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
// actions
import { editTask } from '../../actions';
// styles
import './style.css';
// interfaces
import { TaskInterface, StateInterface } from '../../interfaces';

let shiftX = 0;
let shiftY = 0;
let marginLeft = 0;
let tableWidth = 0;
let startResizePoint = 0;

export const TaskComponent: React.FC<{task: TaskInterface}> = ({task}) => {
    const {tasks, currentUserKey, startDay} = useSelector((state: StateInterface) => state);
    const dispatch = useDispatch();

    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [height, setHeight] = useState(0);
    const [position, setPosition] = useState<'static' | 'absolute'>('static');
    const [width, setWidth] = useState('100%');

    const onDragMove = useCallback((e) => {
        setLeft(e.pageX - shiftX)
        setTop(e.pageY - shiftY)
    }, [])

    const onDragEnd = useCallback((e) => {
        const target = e.target;

        const td = Math.round((e.pageX - shiftX - marginLeft - 73) / ((tableWidth - 73) / 7));
        const day = moment(startDay, 'YYYY-MM-DD').add(td, 'day').format('YYYY-MM-DD');

        const startTop = Math.round((e.pageY - shiftY - 152 - 44) / 50);
        const startHours = Math.floor(startTop * 15 / 60);
        const startMinutes = Math.round((startTop * 15 - startHours * 60) / 15) * 15;

        const endTop = Math.round((e.pageY - shiftY + target.offsetHeight - 152 - 44) / 50);
        const endHours = Math.floor(endTop / 4);
        const endMinutes = Math.round((endTop * 15 - endHours * 60) / 15) * 15;

        const difference = moment(startMinutes, 'mm').diff(moment(task.time.start.split(':')[1], 'mm'), 'minutes');

        if (day === task.day && Math.abs(difference) < 15) {
            target.style.zIndex = 0;

            setTop(0);
            setLeft(0);
            setPosition('static');
            setWidth('auto');
            setHeight(0);

            document.removeEventListener('mousemove', onDragMove)
            document.removeEventListener('mouseup', onDragEnd)
            return;
        }

        e.stopPropagation()

        const time = {
            start: `${startHours < 10 ? '0' + startHours : startHours}:${startMinutes < 10 ? '0' + startMinutes : startMinutes}`,
            end: `${endHours < 10 ? '0' + endHours : endHours}:${endMinutes < 10 ? '0' + endMinutes : endMinutes}`
        }

        const newTask = {
            ...task,
            time,
            day,
        }

        const sameDayTasks = tasks.filter(item => item._id !== task._id && day === item.day);

        sameDayTasks.forEach(item => {
            if (item.time.start >= newTask.time.start && item.time.start <= newTask.time.end) {
                const timeOffset = moment(item.time.start, 'HH:mm').diff(moment(time.end, 'HH:mm'), 'minutes');
                newTask.time.end = item.time.start;
                newTask.time.start = moment(time.start, 'HH:mm').add(timeOffset, 'minutes').format('HH:mm');
            }
            else if (item.time.end >= newTask.time.start && item.time.end <= newTask.time.end) {
                const timeOffset = moment(item.time.end, 'HH:mm').diff(moment(time.start, 'HH:mm'), 'minutes');
                newTask.time.start = item.time.end;
                newTask.time.end = moment(time.end, 'HH:mm').add(timeOffset, 'minutes').format('HH:mm')
            }
        })

        dispatch(editTask(newTask, currentUserKey, task._id, () => {
            shiftX = 0;
            shiftY = 0;
            marginLeft = 0;
            tableWidth = 0;
        }))
        
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd)
    }, [onDragMove, startDay, task, tasks, dispatch, currentUserKey])

    const onDragStart = useCallback((e) => {
        const target = e.target;
        const rect = target.getBoundingClientRect();
        target.style.height = rect.height + 'px';
        target.style.zIndex = 1000;

        shiftX = e.clientX - rect.left;
        shiftY = e.clientY - rect.top; 
        tableWidth = document.body.offsetWidth >= 1200 ? 1152 : document.body.offsetWidth - 48;
        marginLeft =  (document.body.offsetWidth - tableWidth) / 2;

        setLeft(rect.left);
        setTop(rect.top + window.scrollY);
        setPosition('absolute');
        setWidth(rect.width + 'px')

        document.addEventListener('mousemove', onDragMove)
        document.addEventListener('mouseup', onDragEnd)
    }, [onDragMove, onDragEnd])

    
    const bottomResize = useCallback((e) => {
        setHeight(e.pageY - startResizePoint)
    }, [])

    const bottomResizeEnd = useCallback((e) => {
        const duration = (Math.round((e.pageY - startResizePoint) / 50)) * 15;

        const newEnd = moment(task.time.start, 'HH:mm').add(duration, 'minute').format('HH:mm');

        const newTask = {
            ...task,
            time: {
                ...task.time,
                end: newEnd,
            }
        }

        const sameDayTasks = tasks.filter(item => item._id !== task._id && task.day === item.day);

        sameDayTasks.forEach(item => {
            if (item.time.start >= newTask.time.start && item.time.start <= newTask.time.end) {
                newTask.time.end = item.time.start;
            }
            else if (item.time.end >= newTask.time.start && item.time.end <= newTask.time.end) {
                newTask.time.start = item.time.end;
            }
        })

        dispatch(editTask(newTask, currentUserKey, task._id, () => {
            setPosition('static');
            setHeight(0);
            setWidth('auto');
        }))

        document.removeEventListener('mousemove', bottomResize);
        document.removeEventListener('mouseup', bottomResizeEnd);
    }, [bottomResize, task, tasks, dispatch, currentUserKey])

    const bottomResizeStart = useCallback((e) => {
        e.stopPropagation();
        const parent = e.target.parentNode;
        const rect = parent.getBoundingClientRect();

        startResizePoint = rect.top + window.scrollY;

        setHeight(rect.height);
        setLeft(rect.left);
        setTop(rect.top + window.scrollY);
        setPosition('absolute');
        setWidth(rect.width + 'px')

        document.addEventListener('mousemove', bottomResize);
        document.addEventListener('mouseup', bottomResizeEnd)
    }, [bottomResize, bottomResizeEnd])

    const topResize = useCallback((e) => {
        setHeight(startResizePoint - e.pageY)
        setTop(e.pageY)
    }, [])

    const topResizeEnd = useCallback((e) => {
        const duration = (Math.round((startResizePoint - e.pageY) / 50)) * 15;

        const newStart = moment(task.time.end, 'HH:mm').subtract(duration, 'minute').format('HH:mm');

        const newTask = {
            ...task,
            time: {
                ...task.time,
                start: newStart,
            }
        }

        const sameDayTasks = tasks.filter(item => item._id !== task._id && task.day === item.day);

        sameDayTasks.forEach(item => {
            if (item.time.start >= newTask.time.start && item.time.start <= newTask.time.end) {
                newTask.time.end = item.time.start;
            }
            else if (item.time.end >= newTask.time.start && item.time.end <= newTask.time.end) {
                newTask.time.start = item.time.end;
            }
        })

        dispatch(editTask(newTask, currentUserKey, task._id))

        document.removeEventListener('mousemove', topResize);
        document.removeEventListener('mouseup', topResizeEnd);
    }, [topResize, dispatch, currentUserKey, task, tasks])

    const topResizeStart = useCallback((e) => {
        e.stopPropagation()

        const parent = e.target.parentNode;
        const rect = parent.getBoundingClientRect();

        startResizePoint = rect.top + rect.height + window.scrollY;

        setHeight(rect.height);
        setLeft(rect.left);
        setTop(rect.top + window.scrollY);
        setPosition('absolute');
        setWidth(rect.width + 'px');

        document.addEventListener('mousemove', topResize);
        document.addEventListener('mouseup', topResizeEnd);
    }, [topResizeEnd, topResize])

    return(
        <div 
            className="text-cell"
            onMouseDown={onDragStart}
            style={{backgroundColor: !!task ? task.backgroundColor : 'inherit',
                position: position,
                height: height ? height + 'px' : '100%',
                width: width,
                left: left + 'px',
                top: top + 'px',}}>
                    <button className="resize resize-top" onMouseDown={topResizeStart}></button>
                    {!!task ? task.text : ''}
                    <button className="resize resize-bottom" onMouseDown={bottomResizeStart}></button>
        </div>
                                                
    )
}