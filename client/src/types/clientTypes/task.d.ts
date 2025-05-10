import { PopulatedDatabaseQuestion } from '@fake-stack-overflow/shared';

export interface ClientTask {
  assignedUser: string;
  description: string;
  name: string;
  sprint: string | null;
  status: string;
  dependentTasks: DatabaseClientTask[];
  prereqTasks: DatabaseClientTask[];
  project: string;
  priority: string;
  taskPoints: number;
  relevantQuestions: PopulatedDatabaseQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseClientTask extends ClientTask {
  _id: string;
}

export interface RoadmapGraphProps {
  tasks: PopulatedDatabaseTask[];
}
