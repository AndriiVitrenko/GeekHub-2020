import {createSlice} from '@reduxjs/toolkit';
import {io} from 'socket.io-client';

let socket

const toolkitSlice = createSlice({
    name: 'todolist',
    initialState: {
        list: [],
        error: null,
        unsavedText: ''
    },
    reducers: {
        setList(state, action) {
          state.list = action.payload.list || state.list;
        },
        changeItemState(state, action) {
            state.list[action.payload].isDone = !state.list[action.payload].isDone
        },
        deleteItem(state, action) {
            state.list.splice(action.payload, 1)
        },
        clearCompleted(state) {
            state.list = state.list.filter(elem => !elem.isDone)
        },
        editItem(state, action) {
            state.list[action.payload.index].text = action.payload.text
        },
        setError(state, action) {
            state.error = action.payload;
        },
    }
})

export const setConnection = (url) => (dispatch) => {
    socket = io(url)

    socket.on('message', (message) => {
        const body = JSON.parse(message)
        dispatch(setList({list: body.list}))
    })

    socket.on('error', (message) => {
        const error = JSON.parse(message)
        dispatch(setError(error.error))
    })

    socket.emit('message', JSON.stringify({
        type: 'get'
    }))
}

export const sendTodo = (text) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'add todo',
        text,
    }))
}

export const sendUnSavedText = (text) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'unsaved text',
        text,
    }))
}

export const changeAllStates = (state) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'change all states',
        state
    }))
}

export const deleteItem = (index) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'delete todo',
        index,
    }))
}

export const changeItemState = (index) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'change todo state',
        index,
    }))
}

export const editItem = ({index, text}) => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'edit item',
        index,
        text,
    }))
}

export const clearCompleted = () => (dispatch) => {
    socket.emit('message', JSON.stringify({
        type: 'clear completed',
    }))
}

export default toolkitSlice.reducer
export const {
    setList,
    setError,} = toolkitSlice.actions