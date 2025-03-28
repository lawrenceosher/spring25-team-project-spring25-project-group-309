import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { PopulatedDatabaseTask } from './task';

export interface Sprint {
  tasks: ObjectId[];
  name: string;
  project: ObjectId;
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface DatabaseSprint extends Sprint {
  _id: ObjectId;
}

export interface PopulatedDatabaseSprint extends Omit<DatabaseSprint, 'tasks'> {
  tasks: DatabaseTask[];
}

export type SprintResponse = DatabaseSprint | { error: string };

/**
 * Express request for creating a new sprint.
 * - `tasks`: The list of task IDs to include in the sprint (body).
 * - `name`: The name of the sprint (body).
 * - `project`: The project ID the sprint belongs to (body).
 * - `status`: The status of the sprint (body).
 * - `startDate`: The start date of the sprint (body).
 * - `endDate`: The end date of the sprint (body).
 */
export interface CreateSprintRequest extends Request {
  body: {
    tasks: ObjectId[];
    name: string;
    project: ObjectId;
    status: string;
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Express request for querying a sprint by its ID.
 * - `sprintId`: The ID of the sprint to query (params).
 */
export interface SprintRequest extends Request {
  params: {
    sprintId: string;
  };
}

/**
 * Express request for querying sprints by project ID.
 * - `projectId`: The ID of the project to query sprints for (body).
 * - 'updates': The new information to update the sprint with (body).
 */
export interface UpdateSprintRequest extends Request {
  body: {
    sprintId: string;
    updates: Partial<Sprint>;
  };
}

/**
 * Express request for deleting a sprint by its ID.
 */
export interface AddTaskToSprintRequest extends Request {
  body: {
    sprintId: string;
    taskIds: string[];
  };
}

/**
 * Express request for deleting a sprint by its ID.
 * - `sprintId`: The ID of the sprint to delete (params).
 * - 'status': The new status to update the sprint with (body).
 */
export interface UpdateStatusRequest extends Request {
  body: {
    sprintId: string;
    status: SprintStatus;
  };
}

/**
 * Enum that represents the possible statuses of a sprint.
 * - `To Do`: The sprint has not started yet.
 * - `In Progress`: The sprint is currently ongoing.
 * - `Done`: The sprint has been completed.
 */
export type SprintStatus = 'To Do' | 'In Progress' | 'Done';
