import { ObjectId } from 'mongodb';
import { PopulatedDatabaseSprint } from './sprint';
import { PopulatedDatabaseTask } from './task';

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

export interface PopulatedDatabaseProject {
  _id: ObjectId;
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: PopulatedDatabaseSprint[];
  backlogTasks: PopulatedDatabaseTask[];
}

export type ProjectResponse = DatabaseProject | { error: string };
