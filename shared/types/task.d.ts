import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { Project } from './project';
import { DatabaseQuestion } from './question';
import { Sprint } from './sprint';

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
  extends Omit<
    DatabaseTask,
    'sprint' | 'dependentTasks' | 'prereqTasks' | 'project' | 'relevantQuestions'
  > {
  sprint: Sprint;
  dependentTasks: Task[];
  prereqTasks: Task[];
  project: Project;
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
