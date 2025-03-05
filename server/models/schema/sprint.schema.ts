import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Project collection.
 *
 * This schema defines the structure for storing sprints in the database.
 * Each sprint includes the following fields:
 * - 'tasks': The tasks associated with the sprint.
 * - 'name': The name of the sprint.
 * - 'project': The project the sprint belongs to.
 * - 'status': The status of the sprint.
 * - 'start_date': The start date of the sprint.
 * - 'end_date': The end date of the sprint.
 */
const sprintSchema: Schema = new Schema(
  {
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    name: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    status: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: 'Sprint',
    timestamps: true,
  },
);

export default sprintSchema;
