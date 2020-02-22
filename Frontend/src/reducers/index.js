import itemsReducer from './items';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    itemsReducer
});

export default allReducers;
