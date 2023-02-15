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