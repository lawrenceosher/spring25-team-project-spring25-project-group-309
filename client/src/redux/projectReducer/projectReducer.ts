import { createSlice } from '@reduxjs/toolkit';
import {
  DatabaseSprint,
  PopulatedDatabaseProject,
  PopulatedDatabaseTask,
} from '@fake-stack-overflow/shared';

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

    addNewSprintToProject: (state, { payload: newSprint }: { payload: DatabaseSprint }) => {
      if (state.project) {
        state.project.sprints = [...state.project.sprints, newSprint];
      }
    },

    addNewTaskToSprint: (
      state,
      {
        payload: { sprintId, newTask },
      }: { payload: { sprintId: string; newTask: PopulatedDatabaseTask } },
    ) => {
      if (state.project) {
        const sprintIndex = state.project.sprints.findIndex(
          sprint => sprint._id.toString() === sprintId,
        );
        if (sprintIndex !== -1) {
          state.project.sprints[sprintIndex].tasks = [
            ...(state.project.sprints[sprintIndex].tasks || []),
            newTask,
          ];
        }
      }
    },

    addNewTaskToBacklog: (
      state,
      { payload: { newTask } }: { payload: { newTask: PopulatedDatabaseTask } },
    ) => {
      if (state.project) {
        state.project.backlogTasks = [...(state.project.backlogTasks || []), newTask];
      }
    },

    removeSprintFromProject: (state, action) => {
      if (state.project) {
        state.project.sprints = state.project.sprints.filter(
          sprint => sprint._id !== action.payload._id,
        );
      }
    },
  },
});

export const { setProject, addNewSprintToProject, addNewTaskToSprint, addNewTaskToBacklog } =
  projectSlice.actions;
export default projectSlice.reducer;
