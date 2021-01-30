import {clearCompleted} from "../dataBase/toolkitSlice";
import {useDispatch} from "react-redux";
import {useCallback} from 'react';

export function Footer(props) {
    const dispatch = useDispatch()
    const {filterHandler, currentFilter, listLength, doneTodosAmount} = props;

    const clearHandler = useCallback(
        () => {
            dispatch(clearCompleted())
        }
    , [dispatch])

    return(
        <footer className="footer">
            <span className="todo-count"><strong>{listLength - doneTodosAmount}</strong> item left</span>
            <ul className="filters">
                <li>
                    <a onClick={(e) => {e.preventDefault(); filterHandler('all')}} className={currentFilter === 'all' ? 'selected' : ''} href='/'>All</a>
                </li>
                <li>
                    <a onClick={(e) => {e.preventDefault(); filterHandler('active')}} className={currentFilter === 'active' ? 'selected' : ''} href='/'>Active</a>
                </li>
                <li>
                    <a onClick={(e) => {e.preventDefault(); filterHandler('completed')}} className={currentFilter === 'completed' ? 'selected' : ''} href='/'>Completed</a>
                </li>
            </ul>
            {doneTodosAmount ? <button className="clear-completed" onClick = {clearHandler}>Clear completed</button> : <></>}
        </footer>
    )

}