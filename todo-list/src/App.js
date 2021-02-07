import {useState, useCallback} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, changeAllStates} from "./dataBase/toolkitSlice";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
    const todoList = useSelector(state => state.toolkit.list)
    const doneTodosAmount = todoList.filter(todo => todo.isDone === true).length;
    const dispatch = useDispatch()

    const [state, setState] = useState({
        filter: 'all',
        isMarked: false,
        isEditing: false,
    })

    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            dispatch(addTodo(e.target.value))
            e.target.value = ''
        }
    }

    const stateChanger = useCallback(
        () => {
            state.isMarked = !state.isMarked;
            dispatch(changeAllStates(state.isMarked));
        }
    , [state.isMarked])

    const switchEditing = (value) => {
        if (state.isEditing !== value) {
            setState({
                isEditing: value,
            })
        }
    }

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
                            <Route exact path="/:params?/:isEditing?">
                                <TodoList
                                    list={todoList}
                                    switchEditing={switchEditing}
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
