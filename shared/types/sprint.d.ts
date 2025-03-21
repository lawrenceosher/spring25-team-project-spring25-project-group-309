import { ObjectId } from 'mongodb';
import { PopulatedDatabaseTask } from './task';
import { Project } from './project';

export interface Sprint {
  tasks: ObjectId[];
  name: string;
  project: ObjectId;
  status: string;
  start_date: Date;
  end_date: Date;
}

export interface DatabaseSprint extends Sprint {
  _id: ObjectId;
}

export interface PopulatedDatabaseSprint extends Omit<DatabaseSprint, 'tasks' | 'project'> {
  tasks: PopulatedDatabaseTask[];
  project: Project;
}

export type SprintResponse = DatabaseSprint | { error: string };
