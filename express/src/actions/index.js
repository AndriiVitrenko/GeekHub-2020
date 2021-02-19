export const getTodoList = () => {
    return fetchFunction('/api/all', 'GET')
}

export const newTodo = (text) => {
    return fetchFunction('/api/addTodo', 'POST', JSON.stringify({text}))
}

export const toggleItemState = (index) => {
    return fetchFunction('/api/changeItemState', 'PUT', JSON.stringify({index}))
}

export const toggleAllItemsState = (state) => {
    return fetchFunction('/api/changeAllStates', 'POST', JSON.stringify({state}))
}

export const deleteOneItem = (index) => {
    return fetchFunction('/api/deleteItem', 'DELETE', JSON.stringify({index}))
}

export const clearAllCompleted = () => {
    return fetchFunction('/api/clearCompleted', 'POST')
}

export const editItemText = ({index, text}) => {
    return fetchFunction('/api/editItem', 'PUT', JSON.stringify({index, text}))
}

async function fetchFunction(url, method, body = undefined) {
     const response = await fetch(url, {
        method,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body
    })

    if(response.status < 400) {
        return await response.json()
    }
    else {
        const error = await response.json()
        return new Error(error.message)
    }
}