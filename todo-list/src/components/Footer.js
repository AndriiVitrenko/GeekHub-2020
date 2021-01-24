import {clearCompleted} from "../dataBase/toolkitSlice";
import {useDispatch} from "react-redux";

export function Footer(props) {
    const dispatch = useDispatch()
    const {filterHandler, currentFilter, listLength, doneTodosAmount} = props;

    return(
        <footer className="footer">
            <span className="todo-count"><strong>{listLength - doneTodosAmount}</strong> item left</span>
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
    )

}