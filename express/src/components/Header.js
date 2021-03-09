import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {sendTodo, sendUnSavedText} from "../dataBase/toolkitSlice";

export function Header({parentState}) {
    const error = useSelector(state => state.toolkit.error)
    const dispatch = useDispatch()

    const keyPressHandler = useCallback((e) => {
        if (e.key === 'Enter' && e.target.value) {
            parentState.isTyping = false;
            dispatch(sendTodo(e.target.value))
            e.target.value = ''
        }
    }, [])

    const onChangeHandler = useCallback((e) => {
        parentState.isTyping = true;
        dispatch(sendUnSavedText(e.target.value))
    }, [])

    return(
        <header className="header">
            <h1>todos</h1>
            {!!error && <p className='error-text'>{error}</p>}
            <input className="new-todo" type="text" placeholder="What needs to be done?"
                   autoFocus={!parentState.isEditing}
                   onChange={onChangeHandler} onKeyPress={keyPressHandler}/>
        </header>
    )
}