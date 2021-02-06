import {createSlice} from '@reduxjs/toolkit';

const toolkitSlice = createSlice({
    name: 'todolist',
    initialState: {
        list: [
                {text: 'Taste JavaScript', isDone: true},
                {text: 'Buy a unicorn', isDone: false},
        ]
    },
    reducers: {
        addTodo(state, action) {
            state.list.unshift({text: action.payload, isDone: false})
        },
        changeItemState(state, action) {
            state.list[action.payload].isDone = !state.list[action.payload].isDone
        },
        deleteItem(state, action) {
            state.list.splice(action.payload, 1)
        },
        changeAllStates(state, action) {
            state.list.forEach(elem => elem.isDone = action.payload)
        },
        clearCompleted(state) {
            state.list = state.list.filter(elem => !elem.isDone)
        },
        editItem(state, action) {
            state.list[action.payload.index].text = action.payload.text
        }
    }
})

export default toolkitSlice.reducer
export const {addTodo, changeAllStates, changeItemState, deleteItem, clearCompleted, editItem} = toolkitSlice.actions