import itemsReducer from './items';
import orderReducer from './order';
import userAuthReducer from './userAuth';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    orderReducer,
    userAuthReducer
});

export default allReducers;
