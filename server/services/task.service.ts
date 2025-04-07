import { ObjectId } from 'mongodb';
import TaskModel from '../models/task.model';
import ProjectModel from '../models/project.model';
import { updateProject } from './project.service';

import { ProjectResponse, SprintResponse, Task, TaskResponse } from '../types/types';
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

export const addTaskToProject = async (
  taskId: ObjectId,
  projectId: ObjectId,
): Promise<ProjectResponse> => {
  try {
    const project = await ProjectModel.findById(projectId).lean();

    if (!project) {
      throw new Error('Project not found');
    }
    const projectValue = await updateProject(project._id.toString(), {
      $addToSet: { backlogTasks: taskId },
    });
    return projectValue;
  } catch (error) {
    return { error: 'Error when adding task to project' };
  }
};

export const propogateTaskToSprint = async (
  taskId: ObjectId,
  sprintId: ObjectId,
): Promise<SprintResponse> => {
  try {
    const updatedSprint = await SprintModel.findByIdAndUpdate(
      sprintId,
      { $addToSet: { tasks: taskId } },
      { new: true },
    ).lean();
    if (!updatedSprint) {
      throw new Error('Sprint not found');
    }
    return updatedSprint;
  } catch (error) {
    return { error: 'Error when adding task to sprint' };
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
 * Updates a task with new information.
 * @param taskId The ID of the task to update.
 * @param updates The new information to update the task with.
 * @returns The updated task or an error message.
 */
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<TaskResponse> => {
  try {
    const task = await TaskModel.findOne({ _id: taskId }).lean();
    if (!task) {
      throw new Error('Task not found');
    }

    // If sprint is being changed, remove task from old sprint and add to new sprint
    if (updates.sprint) {
      await SprintModel.findOneAndUpdate({ _id: task.sprint }, { $pull: { tasks: taskId } });
    }

    // If sprint is being removed, add task to project backlog
    if (task.sprint && !updates.sprint) {
      await ProjectModel.findOneAndUpdate(
        { _id: task.project },
        { $addToSet: { backlogTasks: taskId } },
      );
      await SprintModel.findOneAndUpdate({ _id: task.sprint }, { $pull: { tasks: taskId } });
    }

    const updatedtask = await TaskModel.findOneAndUpdate({ _id: taskId }, updates, {
      new: true,
    }).lean();

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
