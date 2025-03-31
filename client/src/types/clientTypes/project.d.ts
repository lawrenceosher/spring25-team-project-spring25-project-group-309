import { ClientSprint } from './sprint';
import { ClientTask } from './task';

export interface MockProject {
  _id: string;
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: ClientSprint[];
  backlogTasks: ClientTask[];
}
