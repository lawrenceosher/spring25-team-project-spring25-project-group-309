export interface MockProject {
  _id: string;
  assignedUsers: string[];
  description: string;
  name: string;
  sprints: ObjectId[];
}
