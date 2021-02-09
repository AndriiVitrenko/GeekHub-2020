import {useDispatch} from "react-redux";
import {useCallback} from 'react';
import {changeItemState, deleteItem, editItem} from '../dataBase/toolkitSlice';
import {useHistory} from 'react-router-dom';

export const TodoItem = (props) => {
    const {item, index, isEditing} = props;

    const dispatch = useDispatch();
    const history = useHistory();

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

    const itemChangeHandler = useCallback(
        (event) => {
            dispatch(editItem({
                text: event.target.value,
                index
            }))
        }
    , [index])

    const onBlurHandler = useCallback(
        () => {
            history.push(`/:${index}`)
        }
    , [history, index])

    const onKeyPressHandler = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                onBlurHandler()
            }
        }
    , [onBlurHandler])

    return(
        <li className={(item.isDone ? 'completed ' : '') + (isEditing ? 'editing ' : '')}>
            <div className='view'>
                <input className="toggle" type="checkbox" checked={item.isDone} onChange={onChangeHandler} />
                <label>{item.text}</label>
                <button className="destroy" onClick={deleteHandler} />
            </div>

            <input type="text" className='edit' autoFocus={isEditing} value={item.text} onChange={itemChangeHandler} onBlur={onBlurHandler} onKeyPress={onKeyPressHandler} />
        </li>
    )
}