import itemsReducer from './items';
import orderReducer from './order';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    orderReducer
});

export default allReducers;
