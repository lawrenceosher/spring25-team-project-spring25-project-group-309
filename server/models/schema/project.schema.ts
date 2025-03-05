import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Project collection.
 *
 * This schema defines the structure for storing projects in the database.
 * Each Project includes the following fields:
 * - `assigned_users`: The users assigned to the project.
 * - `description`: The description of the project.
 * - `name`: The name of the project.
 * - `sprints`: The sprints associated with the project.
 * - Timestamps store `createdAt` & `updatedAt`.
 */
const projectSchema: Schema = new Schema(
  {
    assignedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sprints: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
      },
    ],
  },
  {
    collection: 'Project',
  },
);

export default projectSchema;
