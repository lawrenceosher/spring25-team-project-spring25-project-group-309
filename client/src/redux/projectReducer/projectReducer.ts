import { createSlice } from '@reduxjs/toolkit';
import { PopulatedDatabaseProject } from '@fake-stack-overflow/shared';

interface ProjectState {
  project: PopulatedDatabaseProject | null;
}

const initialState: ProjectState = {
  project: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
