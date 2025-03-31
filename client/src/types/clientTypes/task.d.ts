export interface ClientTask {
  assignedUser: string;
  description: string;
  name: string;
  sprint: string | null;
  status: string;
  dependentTasks: string[];
  prereqTasks: string[];
  project: string;
  priority: string;
  taskPoints: number;
  relevantQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}
