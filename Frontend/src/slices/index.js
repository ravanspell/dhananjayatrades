import { combineReducers } from 'redux';
import userSlice from './users.slice';
import orderSlice from './order.slice';

const reducers = combineReducers({
  user: userSlice,
  orders: orderSlice,
});


export default reducers;