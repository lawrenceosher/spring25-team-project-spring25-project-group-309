import TaskModel from '../../models/task.model';
import { addDependentTasks, getAllTasksByUser } from '../../services/task.service';
import { databaseTask } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Task model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getAllTasksByUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });
    it('should return the tasks for the user', async () => {
      mockingoose(TaskModel).toReturn([databaseTask], 'find');
      const tasks = await getAllTasksByUser('test');
      expect(tasks).toEqual([databaseTask]);
    });
  });

  describe('addDependentTasksToTicket', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated task', async () => {
      mockingoose(TaskModel).toReturn(databaseTask, 'findOneAndUpdate');
      const updatedTask = await addDependentTasks('65e9b58910afe6e94fc6e6dc', ['testTask']);
      expect(updatedTask).toEqual(databaseTask);
    });

    it('should return an error if the task is not found', async () => {
      mockingoose(TaskModel).toReturn(null, 'findOneAndUpdate');
      const updatedTask = await addDependentTasks('test', ['testTask']);
      expect('error' in updatedTask).toBe(true);
    });
  });
});
