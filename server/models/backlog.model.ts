import mongoose, { Model } from 'mongoose';
import { DatabaseBacklog } from '@fake-stack-overflow/shared';
import backlogSchema from './schema/backlog.schema';

/**
 * Mongoose model for the `Backlog` collection.
 *
 * This model is created using the `Backlog` interface and the `backlogSchema`, representing the
 * `Backlog` collection in the MongoDB database, and provides an interface for interacting with
 * the stored backlog for a project.
 *
 * @type {Model<DatabaseBacklog>}
 */
const BacklogModel: Model<DatabaseBacklog> = mongoose.model<DatabaseBacklog>(
  'Backlog',
  backlogSchema,
);

export default BacklogModel;
