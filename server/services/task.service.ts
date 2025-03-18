import TaskModel from '../models/task.model';
import { Task, TaskResponse } from '../types/types';

/**
 * Gets all that match a specific criteria.
 * @param criteria The provided criteria to filter by
 * @returns A list of tasks or an error message.
 */
const getTasksByCriteria = async (criteria: object): Promise<TaskResponse[]> => {
  try {
    const tasks = await TaskModel.find(criteria);
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
export const getTasksByUser = async (userId: string): Promise<TaskResponse[]> =>
  getTasksByCriteria({ assigned_user: userId });

/**
 * Get a list of tasks by sprint
 * @param sprintId The sprint ID to get tasks for.
 * @returns A list of tasks or an error message.
 */
export const getTasksBySprint = async (sprintId: string): Promise<TaskResponse[]> =>
  getTasksByCriteria({ sprint: sprintId });

/**
 * Saves a task to the database.
 * @param task The task object to be saved.
 * @returns The saved task or an error.
 */
export const saveTask = async (task: Task): Promise<TaskResponse> => {
  try {
    const result = await TaskModel.create(task);
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
export const updatetask = async (taskId: string, updates: Partial<Task>): Promise<TaskResponse> => {
  try {
    const updatedtask = await TaskModel.findByIdAndUpdate(taskId, updates, { new: true });
    if (!updatedtask) {
      throw Error('task not found');
    }
    return updatedtask;
  } catch (error) {
    return { error: 'Error when updating a task' };
  }
};
/**
 * Deletes a task from the database.
 * @param taskId The ID of the task to be deleted.
 * @returns The deleted task or an error.
 */
export const deleteTask = async (taskId: string): Promise<TaskResponse> => {
  try {
    const result = await TaskModel.findByIdAndDelete(taskId);
    if (!result) {
      throw new Error('Task not found');
    }
    return result;
  } catch (error) {
    return { error: 'Error when deleting a task' };
  }
};
