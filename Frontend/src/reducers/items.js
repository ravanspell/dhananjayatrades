const itemsReducer = (state = { order: [] }, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return state.order.push("item");
        case 'REMOVE_ITEM':
            return state.order;
        case 'UPDATE_ITEM':
            return state.order.push("item");
    }
}

export default itemsReducer;