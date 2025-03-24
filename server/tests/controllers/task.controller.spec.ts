import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { data } from 'vis-network';
import { app } from '../../app';
import * as util from '../../services/task.service';
import {
  project,
  databaseProject,
  databaseSprint,
  databaseTask,
  databaseTaskWithPrereq,
  databaseTaskWithDependency,
  databaseTaskWithAllFields,
} from '../mockData.models';
import TaskModel from '../../models/task.model';

const MOCK_TASK_RESPONSE = [
  {
    _id: databaseTask._id.toString(),
    assignedUser: databaseTask.assignedUser,
    description: databaseTask.description,
    name: databaseTask.name,
    sprint: databaseTask.sprint.toString(),
    status: databaseTask.status,
    dependentTasks: [],
    prereqTasks: [],
    project: databaseTask.project.toString(),
    priority: databaseTask.priority,
    taskPoints: databaseTask.taskPoints,
    relevantQuestions: [],
    createdAt: databaseTask.createdAt.toISOString(),
    updatedAt: databaseTask.updatedAt.toISOString(),
  },
];

const MOCK_TASK_RESPONSE_WITH_DEPENDENCIES = [
  {
    _id: databaseTaskWithDependency._id.toString(),
    assignedUser: databaseTaskWithDependency.assignedUser,
    description: databaseTaskWithDependency.description,
    name: databaseTaskWithDependency.name,
    sprint: databaseTaskWithDependency.sprint.toString(),
    status: databaseTaskWithDependency.status,
    dependentTasks: [databaseTaskWithPrereq._id.toString()],
    prereqTasks: [],
    project: databaseTaskWithDependency.project.toString(),
    priority: databaseTaskWithDependency.priority,
    taskPoints: databaseTaskWithDependency.taskPoints,
    relevantQuestions: [],
    createdAt: databaseTaskWithDependency.createdAt.toISOString(),
    updatedAt: databaseTaskWithDependency.updatedAt.toISOString(),
  },
];

const mockTaskResponse = {
  _id: databaseTask._id.toString(),
  assignedUser: databaseTask.assignedUser,
  description: databaseTask.description,
  name: databaseTask.name,
  sprint: databaseTask.sprint.toString(),
  status: databaseTask.status,
  dependentTasks: [],
  prereqTasks: [],
  project: databaseTask.project.toString(),
  priority: databaseTask.priority,
  taskPoints: databaseTask.taskPoints,
  relevantQuestions: [],
  createdAt: databaseTask.createdAt.toISOString(),
  updatedAt: databaseTask.updatedAt.toISOString(),
};

const mockTaskResponseAllFields = {
  _id: databaseTaskWithAllFields._id.toString(),
  assignedUser: databaseTaskWithAllFields.assignedUser,
  description: databaseTaskWithAllFields.description,
  name: databaseTaskWithAllFields.name,
  sprint: databaseTaskWithAllFields.sprint.toString(),
  status: databaseTaskWithAllFields.status,
  dependentTasks: databaseTaskWithAllFields.dependentTasks,
  prereqTasks: databaseTaskWithAllFields.prereqTasks,
  project: databaseTaskWithAllFields.project.toString(),
  priority: databaseTaskWithAllFields.priority,
  taskPoints: databaseTaskWithAllFields.taskPoints,
  relevantQuestions: databaseTaskWithAllFields.relevantQuestions,
  createdAt: databaseTaskWithAllFields.createdAt.toISOString(),
  updatedAt: databaseTaskWithAllFields.updatedAt.toISOString(),
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

      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when creating a task:');
    });

    it('should return the created task (empty arrays)', async () => {
      createUserSpy.mockResolvedValue(databaseTask);
      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(201);
    });

    it('should return the created task (populated arrays)', async () => {
      createUserSpy.mockResolvedValue(databaseTaskWithAllFields);
      const response = await supertest(app)
        .post('/task/createTask')
        .send(databaseTaskWithAllFields);

      expect(response.status).toBe(201);
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
      getAllTasksByUserSpy.mockResolvedValue([databaseTask]);
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
      addDependentTasksSpy.mockResolvedValue(databaseTask);
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
      getDependentTasksByIdSpy.mockResolvedValue([databaseTaskWithDependency]);
      const response = await supertest(app).get('/task/getDependentTasks/65e9b58910afe6e94fc6e6dc');
      expect(response.body).toEqual(MOCK_TASK_RESPONSE_WITH_DEPENDENCIES);
      expect(response.status).toBe(200);
    });

    it('should return an empty array in the document if the task has no dependent tasks', async () => {
      getDependentTasksByIdSpy.mockResolvedValue([databaseTask]);
      const response = await supertest(app).get('/task/getDependentTasks/test');
      expect(response.body).toEqual(MOCK_TASK_RESPONSE);
      expect(response.status).toBe(200);
    });
  });
});
