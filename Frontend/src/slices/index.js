import { combineReducers } from 'redux';
import userSlice from './users.slice';
import orderSlice from './order.slice';
import customerSlice from './customer.slice';

const reducers = combineReducers({
  user: userSlice,
  orders: orderSlice,
  customers: customerSlice
});


export default reducers;