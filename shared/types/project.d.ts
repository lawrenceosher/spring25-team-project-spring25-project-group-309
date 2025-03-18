import { ObjectId } from 'mongodb';

export interface Project {
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: ObjectId[];
}
export interface DatabaseProject extends Project {
  _id: ObjectId;
}

export type ProjectResponse = DatabaseProject | { error: string };
