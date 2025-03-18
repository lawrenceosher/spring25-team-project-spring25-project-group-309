import { ObjectId } from 'mongodb';
import { Sprint, SprintResponse } from '../types/types';
import SprintModel from '../models/sprint.model';

/**
 * Service to create and add a sprint to the database.
 * @param sprint The sprint object to be saved.
 * @returns The saved sprint object or an error message.
 */
export const saveSprint = async (sprint: Sprint): Promise<SprintResponse> => {
  try {
    const result = await SprintModel.create(sprint);
    return result;
  } catch (error) {
    return { error: 'Error when saving a sprint' };
  }
};

/**
 * Gets all sprints that match a specific criteria.
 * @param criteria The provided criteria to filter by
 * @returns A list of sprints or an error message.
 */
const getSprintsByCriteria = async (criteria: object): Promise<SprintResponse[]> => {
  try {
    const sprints = await SprintModel.find(criteria);
    return sprints;
  } catch (error) {
    return [{ error: 'Error when getting sprints' }];
  }
};

/**
 * Gets all sprints associated with a specific project.
 * @param projectId The ID of the project to get sprints for.
 * @returns A list of sprints or an error message.
 */
export const getSprintsByProjectId = async (projectId: string): Promise<SprintResponse[]> =>
  getSprintsByCriteria({ project: projectId });

/**
 * Gets all sprints with a specific status.
 * @param status The status to filter sprints by.
 * @returns A list of sprints or an error message.
 */
export const getSprintsByStatus = async (status: string): Promise<SprintResponse[]> =>
  getSprintsByCriteria({ status });

/**
 * Updates a sprint with new information.
 * @param sprintId The ID of the sprint to update.
 * @param updates The new information to update the sprint with.
 * @returns The updated sprint or an error message.
 */
export const updateSprint = async (
  sprintId: string,
  updates: Partial<Sprint>,
): Promise<SprintResponse> => {
  try {
    const updatedSprint = await SprintModel.findByIdAndUpdate(sprintId, updates, { new: true });
    if (!updatedSprint) {
      throw Error('Sprint not found');
    }
    return updatedSprint;
  } catch (error) {
    return { error: 'Error when updating a sprint' };
  }
};

export const addTasksToSprint = async (
  sprintId: string,
  taskIds: string[],
): Promise<SprintResponse> => {
  try {
    const updatedSprint = await SprintModel.findOneAndUpdate(
      { _id: new ObjectId(sprintId) },
      { $addToSet: { tasks: { $each: taskIds } } },
      { new: true },
    ).lean();
    if (!updatedSprint) {
      throw new Error('Sprint not found');
    }
    return updatedSprint;
  } catch (error) {
    return { error: 'Error updating sprint' };
  }
};

export const deleteSprintById = async (sprintId: string): Promise<SprintResponse> => {
  try {
    const deletedSprint = await SprintModel.findByIdAndDelete(sprintId);
    if (!deletedSprint) {
      throw Error('Sprint not found');
    }
    return deletedSprint;
  } catch (error) {
    return { error: 'Error when deleting a sprint' };
  }
};
