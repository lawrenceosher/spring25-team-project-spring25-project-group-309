import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { PopulatedDatabaseTask } from './task';

export interface Sprint {
  tasks: Task[];
  name: string;
  project: ObjectId;
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface DatabaseSprint extends Omit<Sprint, 'tasks'> {
  _id: ObjectId;
  tasks: ObjectId[];
}

export interface PopulatedDatabaseSprint extends Omit<DatabaseSprint, 'tasks'> {
  tasks: Task[];
}
export interface AddTaskToSprintRequest extends Request {
  body: {
    sprintId: string;
    taskIds: string[];
  };
}

export interface PopulatedDatabaseSprint extends Omit<DatabaseSprint, 'tasks'> {
  tasks: PopulatedDatabaseTask[];
}

export type SprintResponse = DatabaseSprint | { error: string };
