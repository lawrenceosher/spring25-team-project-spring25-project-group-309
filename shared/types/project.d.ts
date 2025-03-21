import { ObjectId } from 'mongodb';
import { PopulatedDatabaseSprint } from './sprint';
import { PopulatedDatabaseBacklog } from './backlog';

export interface Project {
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: ObjectId[];
  backlog: ObjectId;
}
export interface DatabaseProject extends Project {
  _id: ObjectId;
}

export interface PopulatedDatabaseProject extends Omit<DatabaseProject, 'sprints' | 'backlog'> {
  sprints: PopulatedDatabaseSprint[];
  backlog: PopulatedDatabaseBacklog;
}

export type ProjectResponse = DatabaseProject | { error: string };
