/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTask: null,
};

const selectedTaskSlice = createSlice({
  name: 'selectedTask',
  initialState,
  reducers: {
    setSelectedTask: (state, { payload: clickedTask }) => {
      state.selectedTask = clickedTask;
    },
  },
});

export const { setSelectedTask } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
