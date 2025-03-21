import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseQuestion } from './question';

export interface Task {
  assignedUser: string;
  description: string;
  name: string;
  sprint: ObjectId;
  status: string;
  dependentTasks: ObjectId[];
  prereqTasks: ObjectId[];
  project: ObjectId;
  priority: string;
  taskPoints: number;
  relevantQuestions: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTask extends Task {
  _id: ObjectId;
}

export interface PopulatedDatabaseTask
  extends Omit<DatabaseTask, 'dependentTasks' | 'prereqTasks' | 'relevantQuestions'> {
  dependentTasks: Task[];
  prereqTasks: Task[];
  relevantQuestions: DatabaseQuestion[];
}
export interface AddDependentsRequest extends Request {
  body: {
    taskId: string;
    dependentTaskIds: string[];
  };
}

export interface TasksByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

export type TaskResponse = DatabaseTask | { error: string };
