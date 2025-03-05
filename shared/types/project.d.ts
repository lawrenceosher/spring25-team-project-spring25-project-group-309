import { ObjectId } from 'mongodb';

export interface Project {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  sprints: ObjectId[];
}
export interface DatabaseProject extends Project {
  _id: ObjectId;
}
