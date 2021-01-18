import {useDispatch} from "react-redux";
import {changeItemState, deleteItem} from '../dataBase/toolkitSlice'

export const TodoItem = (props) => {
    const item = props.item
    const index = props.index
    const dispatch = useDispatch()

    return(
        <li className={item.isDone ? 'completed' : ''}>
            <div className="view">
                <input className="toggle" type="checkbox" checked={item.isDone} onChange={() => {dispatch(changeItemState(index))}} />
                <label>{item.text}</label>
                <button className="destroy" onClick={() => {dispatch(deleteItem(index))}}></button>
            </div>
        </li>
    )
}