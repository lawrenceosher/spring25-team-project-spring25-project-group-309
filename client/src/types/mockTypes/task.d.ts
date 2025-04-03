export interface MockTask {
  _id: string;
  assigned_user: string;
  description: string;
  name: string;
  sprint: string;
  status: string;
  dependentTasks: string[];
  prereqForTasks: string[];
  project: string;
  priority: string;
  taskPoints: number;
  relevantQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}
