import { ObjectId } from 'mongodb';

export interface Task {
  assigned_user: ObjectId;
  description: string;
  name: string;
  sprint: ObjectId;
  status: string;
  dependentTasks: ObjectId[];
  prereqForTasks: ObjectId[];
  project: ObjectId;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTask extends Task {
  _id: ObjectId;
}

export type TaskResponse = DatabaseTask | { error: string };
