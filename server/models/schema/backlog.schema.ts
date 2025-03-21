import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Backlog collection.
 *
 * This schema defines the structure for storing a backlog of tasks in the database.
 * Each Backlog includes the following fields:
 * - `project`: The associated project of the backlog.
 * - `tasks`: The tasks in the backlog.
 */
const backlogSchema: Schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    collection: 'Backlog',
  },
);

export default backlogSchema;
