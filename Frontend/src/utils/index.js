import { BOTH, BYOB, DINE_IN, TAKE_WAY } from '../constants';

// short and format order type
export const getOrderType = (orderType) => {
    switch (orderType) {
        case DINE_IN:
            return 'DI'
        case TAKE_WAY:
            return 'TA'
        case BOTH:
            return 'B'
        default:
            return 'DI';
    }
}

// make deep copy - for smaller data sets
export const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data))
}

export const getServiceCharge = (order) => {
    const totalDineIn = order.orderItems
                        .filter((item) => (item.type !== TAKE_WAY))
                        .reduce((total, item) => total + item.total, 0);
    if(order.type === BYOB){
        return totalDineIn / 100 * 20;
    }
    return totalDineIn / 100 * 10;
  }