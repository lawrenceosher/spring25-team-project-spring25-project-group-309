import { ObjectId } from 'mongodb';
import { Request } from 'express';

export interface Task {
  assigned_user: string;
  description: string;
  name: string;
  sprint: ObjectId;
  status: string;
  dependentTasks: ObjectId[];
  prereqForTasks: ObjectId[];
  project: ObjectId;
  priority: number;
  taskPoints: number;
  relevantQuestions: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTask extends Task {
  _id: ObjectId;
}

export interface AddDepedentsRequest extends Request {
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
