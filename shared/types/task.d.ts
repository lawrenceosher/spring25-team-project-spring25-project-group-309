import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseQuestion } from './question';

export interface Task {
  assignedUser: string;
  description: string;
  name: string;
  sprint: ObjectId | null;
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
  dependentTasks: DatabaseTask[];
  prereqTasks: DatabaseTask[];
  relevantQuestions: DatabaseQuestion[];
}

export interface TasksByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

export type TaskResponse = DatabaseTask | { error: string };

/**
 * Express request for creating a new task.
 * - `taskId`: The ID of the task to retrieve dependents for (route parameter).
 */
export interface TaskIdRequest extends Request {
  params: {
    taskId: string;
  };
}

export interface UpdateTaskRequest extends Request {
  body: {
    taskId: string;
    updates: Partial<Task>;
  };
}

/**
 * Express request for creating a new task.
 * - `assignedUser`: The user assigned to the task (body).
 * - `description`: The description of the task (body).
 * - `name`: The name of the task (body).
 * - `sprint`: The sprint the task belongs to (body).
 * - `status`: The status of the task (body).
 * - `dependentTasks`: The tasks that this task is dependent on (body). (Optional)
 * - `prereqTasks`: The tasks that depend on this task (body). (Optional)
 * - `project`: The project the task belongs to (body).
 * - `priority`: The priority of the task (body).
 * - `taskPoints`: The number of points for the task (body).
 * - `relevantQuestions`: The questions relevant to the task (body). (Optional)
 */
export interface CreateTaskRequest extends Request {
  body: {
    assignedUser: string;
    description: string;
    name: string;
    sprint: ObjectId;
    status: string;
    dependentTasks?: ObjectId[];
    prereqTasks?: ObjectId[];
    project: ObjectId;
    priority: string;
    taskPoints: number;
    relevantQuestions?: ObjectId[];
  };
}
