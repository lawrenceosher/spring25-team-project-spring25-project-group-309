import { ObjectId } from 'mongodb';
import { PopulatedDatabaseTask } from './task';
import { Project } from './project';

export interface Backlog {
  project: ObjectId;
  tasks: ObjectId[];
}

export interface DatabaseBacklog extends Backlog {
  _id: ObjectId;
}

export interface PopulatedDatabaseBacklog extends Omit<DatabaseBacklog, 'tasks'> {
  tasks: PopulatedDatabaseTask[];
  project: Project;
}

export type BacklogResponse = DatabaseBacklog | { error: string };
