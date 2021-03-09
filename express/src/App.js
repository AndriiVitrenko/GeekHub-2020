import {useState, useEffect} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {
    getList,
    changeAllStates,
    addTodo,
    deleteItem,
    setUnsavedTodo,
    changeItemState,
    clearCompleted,
    editItem,
} from "./dataBase/toolkitSlice";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import socket from './socket';
import {Header} from "./components/Header";
import {Input} from "./components/Input";

function App() {
    const dispatch = useDispatch()
    const todoList = useSelector(state => state.toolkit.list)

    const [state] = useState({
        isMarked: todoList.filter(item => item.isDone === true).length === todoList.length
        || todoList.filter(item => item.isDone === true).length === 0,
        isEditing: false,
        isTyping: false,
    })

    useEffect(() => {
        socket.on('item:added', ({text}) => {
            dispatch(addTodo(text))
        })

        socket.on('item:unSaved', ({text}) => {
            dispatch(setUnsavedTodo(text))
        })

        socket.on('item:changedState', ({index}) => {
            dispatch(changeItemState(index))
        })

        socket.on('item:deleted', ({index}) => {
            dispatch(deleteItem(index))
        })

        socket.on('list:changedAllStates', ({state}) => {
            dispatch(changeAllStates(state))
        })

        socket.on('list:cleared', () => {
            dispatch(clearCompleted())
        })

        socket.on('item:edited', ({index, text}) => {
            dispatch(editItem({index, text}))
        })

        dispatch(getList())
    }
    , [])

    return (
        <>
            <section className="todoapp">
                <Header parentState={state} />

                <section className="main">
                    <Input parentState={state} />

                    <Router>
                        <Switch>
                            <Route exact path='/:data([a-zA-z]+|:\d+)?'>
                                <TodoList
                                    list={!state.isTyping ? todoList : todoList.filter(item => !item.hasOwnProperty('unSaved'))}
                                />
                            </Route>

                            <Route exact path='/:data(:\d+)/:isEditing(edit)?'>
                                <TodoList
                                    list={!state.isTyping ? todoList : todoList.filter(item => !item.hasOwnProperty('unSaved'))}
                                />
                            </Route>
                        </Switch>

                        <Footer />
                    </Router>
                </section>
            </section>
        </>
    );
}

export default App