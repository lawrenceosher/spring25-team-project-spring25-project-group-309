/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit';
import selectTaskReducer from './selectTask/selectTaskReducer';
import projectReducer from './projectReducer/projectReducer';
import errorReducer from './errorReducer/errorReducer';

const store = configureStore({
  reducer: { selectTaskReducer, projectReducer, errorReducer },
});
export default store;
