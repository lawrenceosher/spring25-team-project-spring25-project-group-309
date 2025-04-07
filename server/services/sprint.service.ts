import { ObjectId } from 'mongodb';
import { DatabaseSprint, ProjectResponse, Sprint, SprintResponse } from '../types/types';
import SprintModel from '../models/sprint.model';
import ProjectModel from '../models/project.model';
import { updateProject } from './project.service';

export const addSprintToProject = async (
  sprintd: ObjectId,
  projectId: ObjectId,
): Promise<ProjectResponse> => {
  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }
    const updatedProject = await updateProject(project._id.toString(), {
      $addToSet: { sprints: sprintd },
    });
    return updatedProject;
  } catch (error) {
    return { error: 'Error when adding task to project' };
  }
};

/**
 * Service to create and add a sprint to the database.
 * @param sprint The sprint object to be saved.
 * @returns The saved sprint object or an error message.
 */
export const saveSprint = async (sprint: Sprint): Promise<SprintResponse> => {
  try {
    const result = await SprintModel.create(sprint);
    await addSprintToProject(result._id, sprint.project);
    return result;
  } catch (error) {
    return { error: 'Error when saving a sprint' };
  }
};

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

export const deleteSprintById = async (sprintId: string): Promise<SprintResponse> => {
  try {
    const deletedSprint: DatabaseSprint | null = await SprintModel.findByIdAndDelete(sprintId);
    if (!deletedSprint) {
      throw Error('Sprint not found');
    }
    await ProjectModel.updateMany({ sprints: sprintId }, { $pull: { sprints: sprintId } });
    await ProjectModel.findByIdAndUpdate(
      deletedSprint.project,
      { $addToSet: { backlogTasks: deletedSprint.tasks } },
      { new: true },
    );

    return deletedSprint;
  } catch (error) {
    return { error: 'Error when deleting a sprint' };
  }
};

/**
 * Gets sprint by id
 * @param criteria The provided id to filter by
 * @returns A sprint or an error message.
 */
export const getSprintbyId = async (sprintId: string): Promise<SprintResponse> => {
  try {
    const sprint: DatabaseSprint | null = await SprintModel.findById(sprintId);

    if (!sprint) {
      throw new Error('Sprint not found');
    }

    return sprint;
  } catch (error) {
    return { error: `Error retrieving sprint: ${error}` };
  }
};
