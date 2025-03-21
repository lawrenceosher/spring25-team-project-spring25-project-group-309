import { ObjectId } from 'mongodb';
import { Request } from 'express';

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

export type SprintResponse = DatabaseSprint | { error: string };
