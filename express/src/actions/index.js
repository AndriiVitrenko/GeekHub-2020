export const getTodoList = () => {
    return fetchFunction('/api/all', 'GET')
        .then(res => {
            return res
        })
        .catch(error => console.error(error))
}

export const newTodo = (text) => {
    return fetchFunction('/api/addTodo', 'POST', JSON.stringify({text}))
        .catch(error => console.error(error))
}

export const toggleItemState = (index) => {
    return fetchFunction('/api/changeItemState', 'PUT', JSON.stringify({index}))
        .catch(error => console.error(error))
}

export const toggleAllItemsState = (state) => {
    return fetchFunction('/api/changeAllStates', 'POST', JSON.stringify({state}))
        .catch(error => console.error(error))
}

export const deleteOneItem = (index) => {
    return fetchFunction('/api/deleteItem', 'DELETE', JSON.stringify({index}))
        .catch(error => console.error(error))
}

export const clearAllCompleted = () => {
    return fetchFunction('/api/clearCompleted', 'POST')
        .catch(error => console.error(error))
}

export const editItemText = ({index, text}) => {
    return fetchFunction('/api/editItem', 'PUT', JSON.stringify({index, text}))
        .catch(error => console.error(error))
}

function fetchFunction(url, method, body = undefined) {
    return new Promise((res, rej) => {
        fetch(url, {
            method,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'Content-Type': 'application/json',
            },
            body
        })
            .then((response) => res(response.json()))
            .catch(error => rej(error))
    })
}