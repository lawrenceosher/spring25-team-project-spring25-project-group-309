export interface MockSprint {
  _id: string;
  tasks: ObjectId[];
  name: string;
  project: ObjectId;
  status: string;
  start_date: Date;
  end_date: Date;
}
