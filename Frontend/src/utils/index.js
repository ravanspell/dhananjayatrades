import { BOTH, DINE_IN, TAKE_WAY } from '../constants';

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
                        .filter((item) => item.type === DINE_IN)
                        .reduce((total, item) => total + item.total, 0);
    return totalDineIn / 100 * 8;
  }