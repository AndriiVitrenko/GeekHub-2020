import {useState} from 'react';
import {TodoList} from "./components/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, changeAllStates, clearCompleted} from "./dataBase/toolkitSlice";


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
                        <input className="new-todo" placeholder="What needs to be done?" autoFocus onKeyPress={keyPressHandler} />
                    </header>
                    <section className="main">
                        <input id="toggle-all" className="toggle-all" type="checkbox" checked={isMarked || (doneTodosAmount === todoList.length)} onChange={() => {}} />
                        <label htmlFor="toggle-all" onClick={() => {setMarked(!isMarked); dispatch(changeAllStates(!isMarked))}} >Mark all as complete</label>

                        <TodoList list = {todoList} filter = {currentFilter} />

                    </section>
                    <footer className="footer">
                        <span className="todo-count"><strong>{todoList.length - doneTodosAmount}</strong> item left</span>
                        <ul className="filters">
                            <li>
                                <a onClick={(e) => {filterHandler('all', e)}} className={currentFilter === 'all' ? 'selected' : ''} href='/'>All</a>
                            </li>
                            <li>
                                <a onClick={(e) => {filterHandler('active', e)}} className={currentFilter === 'active' ? 'selected' : ''} href='/'>Active</a>
                            </li>
                            <li>
                                <a onClick={(e) => {filterHandler('completed', e)}} className={currentFilter === 'completed' ? 'selected' : ''} href='/'>Completed</a>
                            </li>
                        </ul>
                        {doneTodosAmount ? <button className="clear-completed" onClick = {() => dispatch(clearCompleted())}>Clear completed</button> : <></>}
                    </footer>
                </section>
            </>
        );
}

export default App;
