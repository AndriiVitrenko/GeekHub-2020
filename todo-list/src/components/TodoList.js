import {TodoItem} from './TodoItem'

export const TodoList = (props) => {
    const list = props.list
    const filter = props.filter;

        return(
            <ul className='todo-list'>
                {list.map((todo, i) => {
                    if (filter === 'all' || (filter === 'active' && !todo.isDone) || (filter === 'completed' && todo.isDone)) {
                        return <TodoItem item = {todo} index = {i} key = {i} />
                    }
                })}
            </ul>
        )
}