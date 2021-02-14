export const getTodoList = () => {
    return fetch('/api/all', {
        method: 'GET',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
}

export const newTodo = (text) => {
    fetch('/api/addTodo', {
        method: 'POST',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text})
    })
}

export const toggleItemState = (index) => {
    fetch('/api/changeItemState', {
        method: 'PUT',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({index})
    })
}

export const toggleAllItemsState = (state) => {
    fetch('/api/changeAllStates', {
        method: 'POST',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({state})
    })
}

export const deleteOneItem = (index) => {
    fetch('/api/deleteItem', {
        method: 'DELETE',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({index})
    })
}

export const clearAllCompleted = () => {
    fetch('/api/clearCompleted', {
        method: 'POST',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        }
    })
}

export const editItemText = ({index, text}) => {
    fetch('/api/editItem', {
        method: 'PUT',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({index, text})
    })
}