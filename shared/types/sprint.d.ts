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
export interface AddTaskToSprintRequest extends Request {
  body: {
    sprintId: string;
    taskIds: string[];
  };
}

export interface PopulatedDatabaseSprint extends Omit<DatabaseSprint, 'tasks' | 'project'> {
  tasks: PopulatedDatabaseTask[];
}

export type SprintResponse = DatabaseSprint | { error: string };
