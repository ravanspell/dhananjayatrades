export const addItem = () => {
    return {
        type: 'ADD_ITEM'
    };
};
export const removeItem = () => {
    return {
        type: 'REMOVE_ITEM'
    };
};

export const createOrder = (order) => {
    return {
        type: 'CREATE_ORDER',
        data: order
    }
}

export const getOrder = () => {
    return {
        type: 'GET_ORDER'
    }
}
