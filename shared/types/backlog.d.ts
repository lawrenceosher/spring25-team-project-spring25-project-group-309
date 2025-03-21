import { ObjectId } from 'mongodb';

export interface Backlog {
  project: ObjectId;
  tasks: ObjectId[];
}

export interface DatabaseBacklog extends Backlog {
  _id: ObjectId;
}

export type BacklogResponse = DatabaseBacklog | { error: string };
