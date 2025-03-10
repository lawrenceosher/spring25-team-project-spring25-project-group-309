import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Task collection.
 *
 * This schema defines the structure for storing task in the database.
 * Each Task includes the following fields:
 * - `assigned_user`: The user assigned to the task.
 * - `description`: The description of the task.
 * - `name`: The name of the task.
 * - `sprint`: The sprint associated with the task.
 * - `status`: The status of the task.
 * - Timestamps store `createdAt` & `updatedAt`.
 * - 'dependent_tasks': The tasks that this task is dependent on.
 * - 'prereq_for_tasks': The tasks that are dependent on this task.
 * - 'project': The project the task belongs to.
 * - 'priority': The priority of the task.
 */
const taskSchema: Schema = new Schema(
  {
    assigned_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
    },
    status: {
      type: String,
      required: true,
    },
    dependentTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    prereqForTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    priority: {
      type: String,
      required: true,
    },
    taskPoints: {
      type: Number,
      required: true,
    },
    relevantQuestions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  {
    collection: 'Task',
    timestamps: true,
  },
);

export default taskSchema;
