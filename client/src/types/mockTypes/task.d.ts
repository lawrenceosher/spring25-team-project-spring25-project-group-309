import { MockSprint } from './sprint';

export interface MockTask {
  _id: string;
  assigned_user: string;
  description: string;
  name: string;
  sprint: MockSprint;
  status: string;
  dependentTasks: MockTask[];
  prereqForTasks: MockTask[];
  project: string;
  priority: number;
  taskPoints: number;
  relevantQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}
