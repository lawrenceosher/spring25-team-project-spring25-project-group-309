import { ObjectId } from 'mongodb';

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
