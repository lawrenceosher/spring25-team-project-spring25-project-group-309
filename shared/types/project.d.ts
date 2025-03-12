import { ObjectId } from 'mongodb';

export interface Project {
  assignedUsers: String[];
  description: string;
  name: string;
  sprints: ObjectId[];
}
export interface DatabaseProject extends Project {
  _id: ObjectId;
}
