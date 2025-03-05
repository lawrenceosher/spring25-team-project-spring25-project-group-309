import mongoose, { Model } from 'mongoose';
import taskSchema from './schema/task.schema';
import { DatabaseTask } from '../types/types';

/**
 * Mongoose model for the `Task` collection.
 *
 * This model is created using the `Task` interface and the `taskSchema`, representing the
 * `Task` collection in the MongoDB database, and provides an interface for interacting with
 * the stored tasks.
 *
 * @type {Model<DatabaseTask>}
 */
const TaskModel: Model<DatabaseTask> = mongoose.model<DatabaseTask>('Task', taskSchema);

export default TaskModel;
