import SprintModel from '../../models/sprint.model';
import { deleteSprintById, getSprintbyId } from '../../services/sprint.service';
import { databaseSprint } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Sprint model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getSprintById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('Return sprint when invoked', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'findOne');
      const updatedSprint = await getSprintbyId(databaseSprint._id.toString());
      if ('error' in updatedSprint) {
        throw new Error('Expected a sprint, got an error');
      }
      expect(updatedSprint._id).toEqual(databaseSprint._id);
    });

    it('Throw error when necessary', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOne');
      const updatedSprint = await getSprintbyId('test');
      expect('error' in updatedSprint).toBe(true);
    });
  });

  describe('deleteSprintById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('Return deleted sprint when invoked', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'findOneAndDelete');
      const updatedSprint = await deleteSprintById(databaseSprint._id.toString());
      if ('error' in updatedSprint) {
        throw new Error('Expected a sprint, got an error');
      }
      expect(updatedSprint._id).toEqual(databaseSprint._id);
    });

    it('Throw error when necessary', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOneAndDelete');
      const updatedSprint = await deleteSprintById('test');
      expect('error' in updatedSprint).toBe(true);
    });

    it('should throw an error if a database error while deleting', async () => {
      mockingoose(SprintModel).toReturn(new Error('Error deleting object'), 'findOneAndDelete');

      const deletedError = await deleteSprintById('test');

      expect('error' in deletedError).toBe(true);
    });
  });
});
