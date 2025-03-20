/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit';
import selectTaskReducer from './selectTask/selectTaskReducer';

const store = configureStore({
  reducer: { selectTaskReducer },
});
export default store;
