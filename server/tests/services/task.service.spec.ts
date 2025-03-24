import { ObjectId } from 'mongodb';
import TaskModel from '../../models/task.model';
import {
  addDependentTasks,
  getAllTasksByUser,
  getDependentTasksById,
} from '../../services/task.service';
import { databaseTask, databaseTaskWithDependency } from '../mockData.models';
import { DatabaseTask } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

// eslint-disable-next-line @typescript-eslint/naming-convention
const mockDependentTasks: DatabaseTask[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    assignedUser: 'user1',
    description: 'Dep task 1',
    name: 'Task 1',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc'),
    status: 'todo',
    dependentTasks: [],
    prereqTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc'),
    priority: 'high',
    taskPoints: 3,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00'),
    updatedAt: new Date('2023-11-18T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
    assignedUser: 'user2',
    description: 'Dep task 2',
    name: 'Task 2',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc'),
    status: 'in progress',
    dependentTasks: [],
    prereqTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc'),
    priority: 'medium',
    taskPoints: 5,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00'),
    updatedAt: new Date('2023-11-18T09:24:00'),
  },
];

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

  describe('getDependentTasksById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the dependent tasks from the given taskId (1 dependency)', async () => {
      mockingoose(TaskModel).toReturn({ ...databaseTaskWithDependency }, 'findOne');
      const result = await getDependentTasksById(databaseTaskWithDependency._id.toString());
      expect(result).toEqual(databaseTaskWithDependency.dependentTasks);
    });

    it('should return an empty array if the task has no dependencies', async () => {
      mockingoose(TaskModel).toReturn(databaseTask, 'findOne');
      const result = await getDependentTasksById(databaseTask._id.toString());
      expect(result).toEqual([]);
    });

    it('should return an empty array if the task is not found', async () => {
      mockingoose(TaskModel).toReturn(null, 'findOne');
      const result = await getDependentTasksById('test');
      expect(result).toEqual([]);
    });
  });
});
