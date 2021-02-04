import {useDispatch} from "react-redux";
import {useCallback} from 'react';
import {changeItemState, deleteItem} from '../dataBase/toolkitSlice'

export const TodoItem = (props) => {
    const item = props.item
    const index = props.index
    const dispatch = useDispatch()

    const onChangeHandler = useCallback(
        () => {
            dispatch(changeItemState(index))
        }
    , [index])

    const deleteHandler = useCallback(
        () => {
            dispatch(deleteItem(index))
        }
    , [index])

    return(
        <li className={item.isDone ? 'completed' : ''}>
            <div className="view">
                <input className="toggle" type="checkbox" checked={item.isDone} onChange={onChangeHandler} />
                <label>{item.text}</label>
                <button className="destroy" onClick={deleteHandler} />
            </div>
        </li>
    )
}