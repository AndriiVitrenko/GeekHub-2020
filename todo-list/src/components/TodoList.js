import {TodoItem} from './TodoItem';
import {useParams} from 'react-router-dom';

export const TodoList = (props) => {
    const {list} = props;
    const params = {...useParams()};
    params.type = (params.data && params.data.includes(':')) ? 'id' : 'filter';

    if (params.type === 'filter') {
        return(
            <ul className='todo-list'>
                {list.map((todo, i) => {
                    if (params.data === undefined || (params.data === 'active' && !todo.isDone) || (params.data === 'completed' && todo.isDone)) {
                        return <TodoItem item = {todo} index = {i} key = {i} />
                    }
                })}
            </ul>
        )
    }
    else if (params.type === 'id') {
        params.data = Math.min(+params.data.match(/\d+/)[0], list.length - 1)

        return (
            <ul className='todo-list'>
                <TodoItem
                    item = {list[params.data]}
                    key = {list[params.data]}
                    index = {params.data}
                    isEditing = {params.isEditing}
                />
            </ul>
        )
    }
}