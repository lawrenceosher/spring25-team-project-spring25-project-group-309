export interface MockTask {
  _id: string;
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
