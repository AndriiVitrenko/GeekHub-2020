import {useState} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, changeAllStates} from "./dataBase/toolkitSlice";
import {Footer} from "./components/Footer";


function App() {
    const todoList = useSelector(state => state.toolkit.list)
    const doneTodosAmount = todoList.filter(todo => todo.isDone === true).length;
    const dispatch = useDispatch()

    const [currentFilter, setFilter] = useState('all')
    const [isMarked, setMarked] = useState(false)

    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            dispatch(addTodo(e.target.value))
            e.target.value = ''
        }
    }

    const filterHandler = (filter, e) => {
        e.preventDefault()
        if (filter !== currentFilter) {
            setFilter(filter)
        }
    }

        return (
            <>
                <section className="todoapp">
                    <header className="header">
                        <h1>todos</h1>
                        <input className="new-todo" type="text" placeholder="What needs to be done?" autoFocus onKeyPress={keyPressHandler} />
                    </header>
                    <section className="main">
                        <input id="toggle-all" className="toggle-all" type="checkbox" checked={isMarked || (doneTodosAmount === todoList.length)} />
                        <label htmlFor="toggle-all" onClick={() => {setMarked(!isMarked); dispatch(changeAllStates(!isMarked))}} >Mark all as complete</label>

                        <TodoList
                            list = {todoList}
                            filter = {currentFilter}
                        />

                    </section>

                    <Footer
                        filterHandler={filterHandler}
                        currentFilter={currentFilter}
                        listLength={todoList.length}
                        doneTodosAmount={doneTodosAmount}
                    />
                </section>
            </>
        );
}

export default App;
