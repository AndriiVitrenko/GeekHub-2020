import {createSlice} from '@reduxjs/toolkit';

const toolkitSlice = createSlice({
    name: 'todolist',
    initialState: {
        list: [],
        error: null,
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

            state.list.forEach((item, index) => item.index = index)
        },
        editItem(state, action) {
            state.list[action.payload.index].text = action.payload.text
        },
        setError(state, action) {
            state.error = action.payload;
        },
        addTodo(state, action) {
            state.list = state.list.filter(item => !item.hasOwnProperty('unSaved'));

            state.list.unshift({
                text: action.payload,
                index: 0,
                isDone: false,
            })

            state.list.forEach((item, index) => item.index = index)
        },
        setUnsavedTodo(state, action) {
            if (action.payload) {
                if (state.list.some(item => item.hasOwnProperty('unSaved'))) {
                    state.list[0].text = action.payload;
                }
                else {
                    state.list.unshift({
                        text: action.payload,
                        unSaved: true,
                        isDone: false,
                    })
                }
            }
            else {
                state.list = state.list.filter(item => !item.hasOwnProperty('unSaved'));
            }
        },
        changeAllStates(state, action) {
            state.list.forEach(item => item.isDone = action.payload)
        }
    }
})

export const getList = () => (dispatch) => {
    fetchFunction('/api/getList', 'GET')
        .catch(error => dispatch(setError(error)))
}

export const sendTodo = (text) => (dispatch) => {
    fetchFunction(`/api/addTodo`, 'POST', {text})
        .catch(error => dispatch(setError(error)))
}

export const sendUnSavedText = (text) => (dispatch) => {
    fetchFunction(`/api/unSavedText`, 'POST', {text})
        .catch(error => dispatch(setError(error)))
}

export const fetchAllStates = (state) => (dispatch) => {
    fetchFunction(`/api/changeAllStates`, 'POST', {state})
        .catch(error => dispatch(setError(error)))
}

export const fetchDeletedItem = (index) => (dispatch) => {
    fetchFunction(`/api/deleteItem`, 'POST', {index})
        .catch(error => dispatch(setError(error)))
}

export const fetchItemState = (index) => (dispatch) => {
    fetchFunction(`/api/changeItemState`, 'PUT', {index})
        .catch(error => dispatch(setError(error)))
}

export const fetchEditedItem = ({index, text}) => (dispatch) => {
    fetchFunction(`/api/editItem`, 'PUT', {index, text})
        .catch(error => dispatch(setError(error)))
}

export const fetchCleared = () => (dispatch) => {
    fetchFunction(`/api/clearCompleted`, 'POST')
        .catch(error => dispatch(setError(error)))
}

export default toolkitSlice.reducer
export const {
    setList,
    setError,
    addTodo,
    setUnsavedTodo,
    changeItemState,
    changeAllStates,
    deleteItem,
    clearCompleted,
    editItem,
} = toolkitSlice.actions

function fetchFunction (url, method, body = undefined) {
    return fetch(url, {
        method,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
}