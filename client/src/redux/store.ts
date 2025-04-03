/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit';
import selectTaskReducer from './selectTask/selectTaskReducer';
import projectReducer from './projectReducer/projectReducer';

const store = configureStore({
  reducer: { selectTaskReducer, projectReducer },
});
export default store;
