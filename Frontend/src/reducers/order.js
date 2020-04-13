const order = {
    order: ''
}
const orderReducer = (state = order, action) => {
    switch (action.type) {
        case 'CREATE_ORDER':
            return { ...state, order: action.data };
        case 'REMOVE_ORDER':
            return { order: '' };
        case 'GET_ORDER':
            return state;
        default:
            return state

    };
};

export default orderReducer;