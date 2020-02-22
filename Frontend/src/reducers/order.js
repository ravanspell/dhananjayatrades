const order = {
    orderNo: 0,
    orderItems: [],
    itemsAmount: 0,
    totalPrice: 0,
    totalGotPrice: 0
}
const orderReducer = (state = order, action) => {
    switch (action.type) {
        case 'CREATE_ORDER':
            return { ...state, orderNo: state.orderNo };
        case 'REMOVE_ORDER':
            return { order: '' }
    };
};

export default orderReducer;