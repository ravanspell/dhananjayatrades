import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import reducers from './slices';
import logger from 'redux-logger';

const middleware = []

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['orders']
};
//!change this when needed
const showReduxLogs = false;

if(process.env.NODE_ENV !== 'production' && showReduxLogs){
    middleware.push(logger)
}
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(middleware),
});

export default store;