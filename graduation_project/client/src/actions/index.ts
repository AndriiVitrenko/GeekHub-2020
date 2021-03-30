import { setError, setTasks, deleteTask, newTask, changeTask } from "../redux";
import { TaskInterface, UserInterface } from '../interfaces';

const ConnectionError = 'Не удалось подключится к серверу. Проверьте подключение к Интернету и перезагрузите страницу.';

export const getTasks = (userId: string) => (dispatch: any) => {
    fetchFunction('/api/getTasks', 'POST', {
        userId,
    })
        .then(res => res.json())
        .then(res => {
            if (!res.hasOwnProperty('message')) {
                dispatch(setTasks({tasks: res.tasks}))
                dispatch(setError({error: null}))
            }
            else {
                dispatch(setError({error: res.message}))
            }
        })
        .catch(() => dispatch(setError({error: ConnectionError})))
}

export const logIn = (email: string, password: string, callback: (key: string) => void) => (dispatch: any) => {
    fetchFunction('/api/login', 'POST', {
        email,
        password,
    })
        .then(res => res.json())
        .then(res => {
            if (!res.hasOwnProperty('message')) {
                dispatch(setError({error: null}));
                dispatch(setTasks({tasks: res.tasks}));
                callback(res.key);
            }
            else {
                dispatch(setError({error: res.message}))
            }
        })
        .catch(() => dispatch(setError({error: ConnectionError})))
}

export const signUp = ({email, name, surname, phone, password}: UserInterface, callback: (key: string) => void) => (dispatch: any) => {
    fetchFunction('/api/signup', 'POST', {
        email,
        password,
        phone,
        name,
        surname,
    })
    .then(res => res.json())
    .then(res => {
        if (!res.hasOwnProperty('message')) {
            dispatch(setTasks({tasks: res.tasks}))
            dispatch(setError({error: null}))
            callback(res.key)
        }
        else {
            dispatch(setError({error: res.message}))
        }
    })
    .catch(() => dispatch(setError({error: ConnectionError})))
}

export const removeTask = (userId: string, taskId: string) => (dispatch: any) => {
    fetchFunction('/api/deleteTask', 'POST', {
        userId,
        taskId,
    })
    .then(res => res.json())
    .then(res => {
        if (!res.hasOwnProperty('message')) {
            dispatch(deleteTask({
                taskId,
            }))
            dispatch(setError({error: null}))
        }
        else {
            dispatch(setError({error: res.message}))
        }
    })
    .catch(() => dispatch(setError({error: ConnectionError})))
}

export const addNewTask = (task: TaskInterface, userId: string) => (dispatch: any) => {
    fetchFunction('/api/addTask', 'POST', {
        task,
        userId,
    })
        .then(res => res.json())
        .then(res => {
            if (!res.hasOwnProperty('message')) {
                dispatch(setError({error: null}))
                task._id = res.taskId;
                dispatch(newTask({task}))
            }
            else {
                dispatch(setError({error: res.message}))
            }
        })
        .catch(() => dispatch(setError({error: ConnectionError})))
}

export const editTask = (newTask: TaskInterface, userId: string, taskId: string, callback: () => void = () => {}) => (dispatch: any) => {
    fetchFunction('/api/editTask', 'PUT', {
        newTask,
        userId, 
        taskId,
    })
        .then(res => res.json())
        .then(res => {
            if (!res.hasOwnProperty('message')) {
                dispatch(setError({error: null}))
                dispatch(changeTask({index: res.index, newTask}))
                callback()
            }
            else {
                dispatch(setError({error: res.message}))
            }
        })
        .catch(() => dispatch(setError({error: ConnectionError})))
}

function fetchFunction(url: string, method: string, body: any = undefined) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
}