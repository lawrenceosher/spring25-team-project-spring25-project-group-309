import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { app } from '../../app';
import * as util from '../../services/task.service';
import * as data from '../mockData.models';
import TaskModel from '../../models/task.model';

const MOCK_TASK_RESPONSE = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
    assignedUser: 'user123',
    description: 'Complete the sprint task.',
    name: 'Task 1',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
    status: 'Done',
    dependentTasks: [],
    prereqForTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
    priority: 'low',
    taskPoints: 5,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00').toISOString(),
    updatedAt: new Date('2023-11-18T09:24:00').toISOString(),
  },
];

const MOCK_TASK_RESPONSE_WITH_DEPENDENCIES = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
    assignedUser: 'owner',
    description: 'Main task',
    name: 'Main Task',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
    status: 'in progress',
    dependentTasks: [
      new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
      new ObjectId('65e9b58910afe6e94fc6e6df').toString(),
    ],
    prereqForTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
    priority: 'low',
    taskPoints: 8,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00').toISOString(),
    updatedAt: new Date('2023-11-18T09:24:00').toISOString(),
  },
];

const mockTaskResponse = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
  assignedUser: 'user123',
  description: 'Complete the sprint task.',
  name: 'Task 1',
  sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  status: 'Done',
  dependentTasks: [],
  prereqForTasks: [],
  project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
  priority: 'low',
  taskPoints: 5,
  relevantQuestions: [],
  createdAt: new Date('2023-11-18T09:24:00').toISOString(),
  updatedAt: new Date('2023-11-18T09:24:00').toISOString(),
};

const mockTaskResponseAllFields = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
  assignedUser: 'owner',
  description: 'Main task',
  name: 'Main Task',
  sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  status: 'active',
  dependentTasks: [new ObjectId('65e9b58910afe6e94fc6e6dd').toString()],
  prereqForTasks: [new ObjectId('65e9b58910afe6e94fc6e6de').toString()],
  project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
  priority: 'high',
  taskPoints: 8,
  relevantQuestions: [new ObjectId('65e9b58910afe6e94fc6e6df').toString()],
  createdAt: new Date('2023-11-18T09:24:00').toISOString(),
  updatedAt: new Date('2023-11-18T09:24:00').toISOString(),
};

const createUserSpy = jest.spyOn(util, 'saveTask');
const getAllTasksByUserSpy = jest.spyOn(util, 'getAllTasksByUser');
const addDependentTasksSpy = jest.spyOn(util, 'addDependentTasks');
const getDependentTasksByIdSpy = jest.spyOn(util, 'getDependentTasksById');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Test taskController', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('POST /createTask', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).post('/task/createTask').send({
        assignedUser: 'user123',
      });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request');
    });

    it('should return 500 if there is an error', async () => {
      createUserSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).post('/task/createTask').send(data.databaseTask);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when creating a task:');
    });

    it('should return the created task (empty arrays)', async () => {
      createUserSpy.mockResolvedValue(data.databaseTask);
      const response = await supertest(app).post('/task/createTask').send(data.databaseTask);
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(201);
    });

    it('should return the created task (populated arrays)', async () => {
      createUserSpy.mockResolvedValue(data.databaseTaskWithAllFields);
      const response = await supertest(app)
        .post('/task/createTask')
        .send(data.databaseTaskWithAllFields);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTaskResponseAllFields);
    });
  });

  describe('GET /getTaskByUser', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).get('/task/getTaskByUser');
      expect(response.status).toBe(404);
    });

    it('should return 500 if there is an error', async () => {
      getAllTasksByUserSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).get('/task/getTaskByUser/testUser');
      expect(response.status).toBe(500);
    });

    it('should return the updated task', async () => {
      getAllTasksByUserSpy.mockResolvedValue([data.databaseTask]);
      const response = await supertest(app).get('/task/getTaskByUser/testUser');
      expect(response.body).toEqual(MOCK_TASK_RESPONSE);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /addDependentTasks', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).put('/task/addDependentTasks').send({ taskId: 'test' });
      expect(response.status).toBe(400);
    });
    it('should return 500 if there is an error', async () => {
      addDependentTasksSpy.mockImplementation(() => {
        throw new Error('Test error');
      });
      const response = await supertest(app)
        .put('/task/addDependentTasks')
        .send({ taskId: 'test', dependentTaskIds: ['testTask'] });
      expect(response.status).toBe(500);
    });
    it('should return the updated task', async () => {
      addDependentTasksSpy.mockResolvedValue(data.databaseTask);
      const response = await supertest(app)
        .put('/task/addDependentTasks')
        .send({ taskId: 'test', dependentTaskIds: ['testTask'] });
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /getDependentTasks', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).get('/task/getDependentTasks/');
      expect(response.status).toBe(404);
    });

    it('should return 500 if there is an error', async () => {
      const error = new Error('Test error');
      getDependentTasksByIdSpy.mockRejectedValue(error);
      const response = await supertest(app).get('/task/getDependentTasks/test');
      expect(response.status).toBe(500);
    });

    it('should return the dependent tasks of the given taskId', async () => {
      getDependentTasksByIdSpy.mockResolvedValue([data.databaseTaskWithDependencies]);
      const response = await supertest(app).get('/task/getDependentTasks/65e9b58910afe6e94fc6e6dc');
      expect(response.body).toEqual(MOCK_TASK_RESPONSE_WITH_DEPENDENCIES);
      expect(response.status).toBe(200);
    });

    it('should return an empty array in the document if the task has no dependent tasks', async () => {
      getDependentTasksByIdSpy.mockResolvedValue([data.databaseTask]);
      const response = await supertest(app).get('/task/getDependentTasks/test');
      expect(response.body).toEqual(MOCK_TASK_RESPONSE);
      expect(response.status).toBe(200);
    });
  });
});
