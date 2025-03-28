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

export interface SprintRequest extends Request {
  body: {
    sprintId: string;
  };
}

export interface UpdateSprintRequest extends SprintRequest {
  body: {
    sprintId: string;
    updates: Partial<Sprint>;
  };
}

export interface AddTaskToSprintRequest extends SprintRequest {
  body: {
    sprintId: string;
    taskIds: string[];
  };
}
