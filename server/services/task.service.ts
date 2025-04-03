import { ObjectId } from 'mongodb';
import TaskModel from '../models/task.model';
import ProjectModel from '../models/project.model';
import { updateProject } from './project.service';

import { DatabaseTask, Task, TaskResponse } from '../types/types';
import SprintModel from '../models/sprint.model';

/**
 * Gets all that match a specific criteria.
 * @param criteria The provided criteria to filter by
 * @returns A list of tasks or an error message.
 */
export const getTasksByCriteria = async (criteria: object): Promise<TaskResponse[]> => {
  try {
    const tasks = await TaskModel.find(criteria).lean();
    if (!tasks) {
      throw new Error('No tasks found');
    }
    return tasks;
  } catch (error) {
    return [{ error: 'Error when getting tasks' }];
  }
};
/**
 * Get all tasks for a specific user
 * @param userId The user ID to get tasks for
 * @returns A list of tasks or an error message.
 */
export const getAllTasksByUser = async (userId: string): Promise<TaskResponse[]> =>
  getTasksByCriteria({ assignedUser: userId });

/**
 * Get a list of tasks by sprint
 * @param sprintId The sprint ID to get tasks for.
 * @returns A list of tasks or an error message.
 */
export const getTasksBySprint = async (sprintId: string): Promise<TaskResponse[]> =>
  getTasksByCriteria({ sprint: sprintId });

/**
 * Gets the dependent tasks of a task by its ID.
 * @param taskId The ID of the task to get dependent tasks for.
 * @returns An array of dependent tasks or an error message. If the task is not found, an empty array is returned.
 */
export const getDependentTasksById = async (taskId: string): Promise<TaskResponse[]> => {
  try {
    const task = await TaskModel.findById(taskId)
      .populate<{ dependentTasks: DatabaseTask[] }>('dependentTasks')
      .lean();
    if (!task) {
      throw new Error('Task not found');
    }
    return task.dependentTasks;
  } catch (error) {
    return [];
  }
};

const addTaskToProject = async (taskId: ObjectId, projectId: ObjectId): Promise<void> => {
  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }
    await updateProject(project._id.toString(), {
      $addToSet: { backlogTasks: taskId },
    });
  } catch (error) {
    throw new Error('Error when adding task to project');
  }
};

const propogateTaskToSprint = async (taskId: ObjectId, sprintId: ObjectId): Promise<void> => {
  try {
    await SprintModel.findByIdAndUpdate(sprintId, { $addToSet: { tasks: taskId } }, { new: true });
  } catch (error) {
    throw new Error('Error when adding task to sprint');
  }
};

/**
 * Saves a task to the database.
 * @param task The task object to be saved.
 * @returns The saved task or an error.
 */
export const saveTask = async (task: Task): Promise<TaskResponse> => {
  try {
    const result = await TaskModel.create(task);
    if (!result.sprint) {
      await addTaskToProject(result._id, result.project);
    } else {
      await propogateTaskToSprint(result._id, result.sprint);
    }

    return result;
  } catch (error) {
    return { error: 'Error when saving a task' };
  }
};

/**
 * Gets a task by its ID.
 * @param taskId The ID of the task to get.
 * @returns The task or an error message.
 */
export const getTaskById = async (taskId: string): Promise<TaskResponse> => {
  try {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  } catch (error) {
    return { error: 'Error when getting a task' };
  }
};

/**
 * Updates a task with new information.
 * @param taskId The ID of the task to update.
 * @param updates The new information to update the task with.
 * @returns The updated task or an error message.
 */
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<TaskResponse> => {
  try {
    const task = await TaskModel.findById(taskId).lean();
    if (!task) {
      throw new Error('Task not found');
    }

    // If sprint is being changed, remove task from old sprint and add to new sprint
    if (updates.sprint) {
      await SprintModel.findByIdAndUpdate(task.sprint, { $pull: { tasks: taskId } });
    }

    // If sprint is being removed, add task to project backlog
    if (task.sprint && !updates.sprint) {
      await ProjectModel.findByIdAndUpdate(task.project, { $addToSet: { backlogTasks: taskId } });
      await SprintModel.findByIdAndUpdate(task.sprint, { $pull: { tasks: taskId } });
    }

    const updatedtask = await TaskModel.findByIdAndUpdate(taskId, updates, { new: true }).lean();

    if (!updatedtask) {
      throw Error('task not found');
    }

    // If sprint is being changed, add task to new sprint
    if (updatedtask.sprint) {
      await propogateTaskToSprint(updatedtask._id, updatedtask.sprint);
      await ProjectModel.updateMany(
        { backlogTasks: updatedtask._id },
        { $pull: { backlogTasks: updatedtask._id } },
      );
    }

    return updatedtask;
  } catch (error) {
    return { error: 'Error when updating a task' };
  }
};

/**
 * Updates a list of tasks with new information.
 * @param taskId The ID of the task to add to.
 * @param dependentTaskIds The IDs of the tasks to add as dependencies.
 * @returns The Updated Task
 */
export const addDependentTasks = async (
  taskId: string,
  dependentTaskIds: string[],
): Promise<TaskResponse> => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $addToSet: { dependentTasks: { $each: dependentTaskIds } } },
      { new: true },
    ).lean();
    if (!updatedTask) {
      throw new Error('Task not found');
    }

    return updatedTask;
  } catch (error) {
    return { error: 'Error when adding dependent tasks' };
  }
};
/**
 * Deletes a task from the database.
 * @param taskId The ID of the task to be deleted.
 * @returns The deleted task or an error.
 */
export const deleteTaskById = async (taskId: string): Promise<TaskResponse> => {
  try {
    const result = await TaskModel.findByIdAndDelete(taskId).lean();
    if (!result) {
      throw new Error('Task not found');
    }
    await ProjectModel.updateMany({ backlogTasks: taskId }, { $pull: { backlogTasks: taskId } });
    await SprintModel.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
    await TaskModel.updateMany({ dependentTasks: taskId }, { $pull: { dependentTasks: taskId } });
    await TaskModel.updateMany({ prereqTasks: taskId }, { $pull: { prereqTasks: taskId } });
    return result;
  } catch (error) {
    return { error: 'Error when deleting a task' };
  }
};
