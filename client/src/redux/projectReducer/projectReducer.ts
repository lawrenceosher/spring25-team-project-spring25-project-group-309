import { createSlice } from '@reduxjs/toolkit';
import { project1 } from '../../mockData/mockData';
import { MockTask } from '../../types/mockTypes/task';
import { MockSprint } from '../../types/mockTypes/sprint';

const initialState = {
  project: project1,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addNewTask: (state, { payload: newTask }: { payload: MockTask }) => {
      if (newTask.sprint === state.project.backlog._id) {
        state.project.backlog.tasks = [...state.project.backlog.tasks, newTask];
        return;
      }

      const updatedSprints = state.project.sprints.map(sprint => {
        if (sprint._id === newTask.sprint) {
          return {
            ...sprint,
            tasks: [...sprint.tasks, newTask],
          };
        }
        return sprint;
      });

      state.project = { ...state.project, sprints: updatedSprints };
    },

    addNewSprint: (state, { payload: newSprint }: { payload: MockSprint }) => {
      state.project.sprints = [...state.project.sprints, newSprint];
    },
  },
});

export const { addNewTask, addNewSprint } = projectSlice.actions;
export default projectSlice.reducer;
