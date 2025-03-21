import { ObjectId } from 'mongodb';
import { PopulatedDatabaseSprint } from './sprint';

export interface Project {
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: ObjectId[];
  backlogTasks: ObjectId[];
}
export interface DatabaseProject extends Project {
  _id: ObjectId;
}

export interface PopulatedDatabaseProject extends Omit<DatabaseProject, 'sprints'> {
  sprints: PopulatedDatabaseSprint[];
}

export type ProjectResponse = DatabaseProject | { error: string };
