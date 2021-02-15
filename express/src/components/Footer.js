import {clearCompleted} from "../dataBase/toolkitSlice";
import {useDispatch} from "react-redux";
import {useCallback} from 'react';
import {NavLink} from "react-router-dom";
import {clearAllCompleted} from "../actions";

export function Footer(props) {
    const dispatch = useDispatch()
    const {listLength, doneTodosAmount} = props;

    const clearHandler = useCallback(
        () => {
            clearAllCompleted()
                .then((res) => {
                    if (res.ok) {
                        dispatch(clearCompleted())
                    }
                })

        }
    , [])

    return(
        <footer className="footer">
            <span className="todo-count"><strong>{listLength - doneTodosAmount}</strong> item left</span>
            <ul className="filters">
                <li>
                    <NavLink exact to="/" activeClassName="selected" >All</NavLink>
                </li>
                <li>
                    <NavLink to="/active" activeClassName='selected' >Active</NavLink>
                </li>
                <li>
                    <NavLink to="/completed" activeClassName='selected' >Completed</NavLink>
                </li>
            </ul>
            {doneTodosAmount ? <button className="clear-completed" onClick = {clearHandler}>Clear completed</button> : <></>}
        </footer>
    )

}