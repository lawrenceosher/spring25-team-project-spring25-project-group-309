import { ClientTask } from './task';

export interface ClientSprint {
  _id: string;
  tasks: ClientTask[];
  name: string;
  project: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
