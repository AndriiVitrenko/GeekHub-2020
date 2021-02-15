import {useState, useCallback, useEffect} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, changeAllStates, setList} from "./dataBase/toolkitSlice";
import {getTodoList, newTodo, toggleAllItemsState} from "./actions";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
    const dispatch = useDispatch()

    useEffect(
        () => {
            getTodoList()
                .then(result => {
                    dispatch(setList({list: result.list}))
                })
        }
    , [])

    const todoList = useSelector(state => state.toolkit.list)
    const doneTodosAmount = todoList.filter(todo => todo.isDone === true).length;

    const [state] = useState({
        filter: 'all',
        isMarked: false,
        isEditing: false,
    })

    const keyPressHandler = useCallback((e) => {
        if (e.key === 'Enter') {
            const text = e.target.value;
            newTodo(text)
                .then((res) => {
                    if (res.ok) {
                        dispatch(addTodo(text));
                        e.target.value = ''
                    }
                })
        }
    }, [])

    const stateChanger = useCallback(
        () => {
            state.isMarked = !state.isMarked;
            toggleAllItemsState(state.isMarked)
                .then((res) => {
                    if (res.ok) {
                        dispatch(changeAllStates(state.isMarked))
                    }
                })
        }
    , [state.isMarked])

    return (
        <>
            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <input className="new-todo" type="text" placeholder="What needs to be done?" autoFocus={!state.isEditing}
                           onKeyPress={keyPressHandler}/>
                </header>
                <section className="main">
                    <input id="toggle-all" className="toggle-all" type="checkbox"
                           checked={state.isMarked || (doneTodosAmount === todoList.length)} readOnly/>
                    <label htmlFor="toggle-all" onClick={stateChanger}>Mark all as complete</label>

                    <Router>
                        <Switch>
                            <Route exact path='/:data([a-zA-z]+|:\d+)?' >
                                <TodoList
                                    list={todoList}
                                />
                            </Route>

                            <Route exact path='/:data(:\d+)/:isEditing(edit)?' >
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
