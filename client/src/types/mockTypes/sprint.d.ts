import { MockTask } from './task';

export interface MockSprint {
  _id: string;
  tasks: MockTask[];
  name: string;
  project: string;
  status: string;
  start_date: Date;
  end_date: Date;
}
