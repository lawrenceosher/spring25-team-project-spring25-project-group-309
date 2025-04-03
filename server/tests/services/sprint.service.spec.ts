import SprintModel from '../../models/sprint.model';
import { addTasksToSprint } from '../../services/sprint.service';
import { databaseSprint } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Sprint model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('addTasksToSprint', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated sprint', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'findOneAndUpdate');
      const updatedSprint = await addTasksToSprint('65e9b58910afe6e94fc6e6dc', ['testTask']);
      expect(updatedSprint).toEqual(databaseSprint);
    });

    it('should return an error if the sprint is not found', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOneAndUpdate');
      const updatedSprint = await addTasksToSprint('test', ['testTask']);
      expect('error' in updatedSprint).toBe(true);
    });
  });
});
