import {useState, useCallback} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, changeAllStates} from "./dataBase/toolkitSlice";
import {Footer} from "./components/Footer";

function App() {
    const todoList = useSelector(state => state.toolkit.list)
    const doneTodosAmount = todoList.filter(todo => todo.isDone === true).length;
    const dispatch = useDispatch()

    const [state, setState] = useState({
        filter: 'all',
        isMarked: false,
    })

    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            dispatch(addTodo(e.target.value))
            e.target.value = ''
        }
    }

    const filterHandler = (filter) => {
        if (filter !== state.filter) {
            setState({filter})
        }
    }

    const stateChanger = useCallback(
        () => {
            setState({isMarked: !state.isMarked});
            dispatch(changeAllStates(!state.isMarked))
        }
    , [state.isMarked])

        return (
            <>
                <section className="todoapp">
                    <header className="header">
                        <h1>todos</h1>
                        <input className="new-todo" type="text" placeholder="What needs to be done?" autoFocus onKeyPress={keyPressHandler} />
                    </header>
                    <section className="main">
                        <input id="toggle-all" className="toggle-all" type="checkbox" checked={state.isMarked || (doneTodosAmount === todoList.length)} />
                        <label htmlFor="toggle-all" onClick={stateChanger} >Mark all as complete</label>

                        <TodoList
                            list = {todoList}
                            filter = {state.filter}
                        />

                    </section>

                    <Footer
                        filterHandler={filterHandler}
                        currentFilter={state.filter}
                        listLength={todoList.length}
                        doneTodosAmount={doneTodosAmount}
                    />
                </section>
            </>
        );
}

export default App;
