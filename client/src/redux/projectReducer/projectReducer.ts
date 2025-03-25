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

    updateTaskStatus: (
      state,
      { payload: { task, newStatus } }: { payload: { task: MockTask; newStatus: string } },
    ) => {
      // Find the sprint containing the task
      const correspondingSprint = state.project.sprints.find(s => s._id === task.sprint);
      if (!correspondingSprint) {
        return;
      }

      // Update the task's status
      const updatedTask: MockTask = { ...task, status: newStatus };

      // Update the tasks in the sprint
      const updatedTasks = correspondingSprint.tasks.map(t =>
        t._id === updatedTask._id ? updatedTask : t,
      );

      // Update the sprints in the project
      const updatedSprints = state.project.sprints.map(sprint => {
        if (sprint._id === updatedTask.sprint) {
          return {
            ...sprint,
            tasks: updatedTasks,
          };
        }
        return sprint;
      });

      // Update the project state
      state.project = { ...state.project, sprints: updatedSprints };
    },
  },
});

export const { addNewTask, addNewSprint, updateTaskStatus } = projectSlice.actions;
export default projectSlice.reducer;
