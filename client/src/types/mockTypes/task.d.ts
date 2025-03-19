export interface MockTask {
  _id: string;
  assigned_user: string;
  description: string;
  name: string;
  sprint: string;
  status: string;
  dependentTasks: MockTask[];
  prereqForTasks: MockTask[];
  project: string;
  priority: number;
  taskPoints: number;
  relevantQuestions: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
