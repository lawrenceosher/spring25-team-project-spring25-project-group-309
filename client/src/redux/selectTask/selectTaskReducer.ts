/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';
import { project1 } from '../../mockData/mockData';

const initialState = {
  selectedTask: project1.sprints[0].tasks[0],
};

const selectedTaskSlice = createSlice({
  name: 'selectedTask',
  initialState,
  reducers: {
    setSelectedTask: (state, { payload: newTask }) => {
      state.selectedTask = newTask;
    },
  },
});

export const { setSelectedTask } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
