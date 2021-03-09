import {useCallback} from "react";
import {fetchAllStates} from "../dataBase/toolkitSlice";
import {useDispatch} from "react-redux";

export function Input({parentState}) {
    const dispatch = useDispatch()

    const stateChanger = useCallback(
        () => {
            parentState.isMarked = !parentState.isMarked;
            dispatch(fetchAllStates(parentState.isMarked))
        }
        , [parentState.isMarked])

    return(
        <>
            <input id="toggle-all" className="toggle-all" type="checkbox"
                   checked={parentState.isMarked} readOnly/>
            <label htmlFor="toggle-all" onClick={stateChanger}>Mark all as complete</label>
        </>
    )
}