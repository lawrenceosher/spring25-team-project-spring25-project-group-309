import { ObjectId } from 'mongodb';

export interface Task {
  name: string;
  description: string;
  status: string;
  assignedTo: ObjectId;
  dueDate: Date;
}

export interface DatabaseTask extends Task {
  _id: ObjectId;
}
