import mongoose, { Model } from 'mongoose';
import sprintSchema from './schema/sprint.schema';
import { DatabaseSprint } from '../types/types';

/**
 * Mongoose model for the `Sprint` collection.
 *
 * This model is created using the `Sprint` interface and the `sprintSchema`, representing the
 * `Sprint` collection in the MongoDB database, and provides an interface for interacting with
 * the stored sprints.
 *
 * @type {Model<DatabaseSprint>}
 */
const SprintModel: Model<DatabaseSprint> = mongoose.model<DatabaseSprint>('Sprint', sprintSchema);

export default SprintModel;
