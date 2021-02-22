import {useState, useCallback, useEffect} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {setConnection, sendTodo, sendUnSavedText, changeAllStates} from "./dataBase/toolkitSlice";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
    const dispatch = useDispatch()

    const todoList = useSelector(state => state.toolkit.list)
    const error = useSelector(state => state.toolkit.error)
    const doneTodosAmount = todoList.filter(todo => todo.isDone === true).length;

    const [state] = useState({
        filter: 'all',
        isMarked: todoList.filter(item => item.isDone === true).length === todoList.length,
        isEditing: false,
        isTyping: false,
    })

    useEffect(() => {
            dispatch(setConnection('127.0.0.1:8000'))
        }
        , [])

    const keyPressHandler = useCallback((e) => {
        if (e.key === 'Enter' && e.target.value) {
            state.isTyping = false
            dispatch(sendTodo(e.target.value))
            e.target.value = ''
        }
    }, [])

    const onChangeHandler = useCallback((e) => {
        state.isTyping = true
        dispatch(sendUnSavedText(e.target.value))
    }, [])

    const stateChanger = useCallback(
        () => {
            state.isMarked = !state.isMarked;
            dispatch(changeAllStates(state.isMarked))
        }
        , [state.isMarked])

    return (
        <>
            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    {error ? <p className='error-text'>{error}</p> : <></>}
                    <input className="new-todo" type="text" placeholder="What needs to be done?"
                           autoFocus={!state.isEditing}
                           onChange={onChangeHandler} onKeyPress={keyPressHandler}/>
                </header>
                <section className="main">
                    <input id="toggle-all" className="toggle-all" type="checkbox"
                           checked={state.isMarked} readOnly/>
                    <label htmlFor="toggle-all" onClick={stateChanger}>Mark all as complete</label>

                    <Router>
                        <Switch>
                            <Route exact path='/:data([a-zA-z]+|:\d+)?'>
                                <TodoList
                                    list={todoList}
                                />
                            </Route>

                            <Route exact path='/:data(:\d+)/:isEditing(edit)?'>
                                <TodoList
                                    list={todoList}
                                />
                            </Route>
                        </Switch>

                        <Footer
                            listLength={todoList.length}
                            doneTodosAmount={doneTodosAmount}
                        />
                    </Router>
                </section>
            </section>
        </>
    );
}

export default App
