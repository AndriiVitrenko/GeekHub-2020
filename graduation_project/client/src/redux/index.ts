import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { TaskInterface, StateInterface } from '../interfaces';
import { date, getStartOfWeek, getEndOfWeek } from '../service';

const calendarSlice = createSlice({
    name: 'calendarSlice',
    initialState: {
        currentUserKey: '',
        tasks: [],
        startDay: getStartOfWeek(),
        endDay: getEndOfWeek(),
        error: null,
        focusedTime: '',
    } as StateInterface,
    reducers: {
        setTasks(state, action: PayloadAction<{tasks: TaskInterface[]}>) {
            state.tasks = action.payload.tasks;
        },
        newTask(state, action: PayloadAction<{task: TaskInterface}>) {
            state.tasks = [...state.tasks, action.payload.task]
        },
        deleteUser(state) {
            state.currentUserKey = '';
            state.tasks = [];
        },
        changeWeek(state, action: PayloadAction<{change: number}>) {
            date.add(action.payload.change, 'week')

            state.startDay = getStartOfWeek();
            state.endDay = getEndOfWeek();
        },
        setError(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error;
        },
        setUser(state, action: PayloadAction<{key: string}>) {
            state.currentUserKey = action.payload.key;
        },
        setFocus(state, action: PayloadAction<{focus: string}>) {
            state.focusedTime = action.payload.focus;
        },
        deleteTask(state, action: PayloadAction<{taskId: string}>) {
            state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId)
        },
        changeTask(state, action: PayloadAction<{index: number, newTask: TaskInterface}>) {
            state.tasks[action.payload.index] = action.payload.newTask;
        }
    }
})

export const store = configureStore({
    reducer: calendarSlice.reducer,
})

export const {
    changeWeek,
    setTasks,
    setError,
    setUser,
    deleteUser,
    newTask,
    setFocus,
    deleteTask,
    changeTask,
} = calendarSlice.actions;