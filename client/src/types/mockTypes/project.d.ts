import { MockBacklog } from './backlog';
import { MockSprint } from './sprint';

export interface MockProject {
  _id: string;
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: MockSprint[];
  backlog: MockBacklog;
}
