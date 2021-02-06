import {TodoItem} from './TodoItem';
import {useParams} from 'react-router-dom';

export const TodoList = (props) => {
    const {list, switchEditing} = props;
    const params = {
        data: useParams().params,
        isEditing: props.isEditing,
    }
    params.type = (params.data && params.data.includes(':')) ? 'id' : 'filter';

    if (params.isEditing) {
        switchEditing(true)
    }

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
        params.data = Math.min(params.data.match(/\d+/)[0], list.length - 1)

        return(
            <ul className='todo-list'>
                <TodoItem item={list[params.data]} index={params.data} key={params.data} isEditing={params.isEditing} switchEditing={switchEditing} />
            </ul>
        )
    }
}