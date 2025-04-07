import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { data } from 'vis-network';
import { PopulatedDatabaseTask } from '@fake-stack-overflow/shared/types/task';
import { app } from '../../app';
import * as util from '../../services/task.service';
import * as dbUtil from '../../utils/database.util';
import {
  databaseTask,
  databaseTaskWithPrereq,
  databaseTaskWithDependency,
  databaseTaskWithAllFields,
} from '../mockData.models';

const MOCK_TASK_RESPONSE = [
  {
    _id: databaseTask._id.toString(),
    assignedUser: databaseTask.assignedUser,
    description: databaseTask.description,
    name: databaseTask.name,
    sprint: databaseTask.sprint?.toString(),
    status: databaseTask.status,
    dependentTasks: [],
    prereqTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
    priority: 'low',
    taskPoints: 5,
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
    sprint: databaseTaskWithDependency.sprint?.toString(),
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
  sprint: databaseTask.sprint?.toString(),
  status: databaseTask.status,
  dependentTasks: [],
  prereqTasks: [],
  project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
  priority: 'low',
  taskPoints: 5,
  relevantQuestions: [],
  createdAt: databaseTask.createdAt.toISOString(),
  updatedAt: databaseTask.updatedAt.toISOString(),
};

const mockTaskResponseAllFields = {
  _id: databaseTaskWithAllFields._id.toString(),
  assignedUser: databaseTaskWithAllFields.assignedUser,
  description: databaseTaskWithAllFields.description,
  name: databaseTaskWithAllFields.name,
  sprint: databaseTaskWithAllFields.sprint?.toString(),
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

const createTaskSpy = jest.spyOn(util, 'saveTask');
const deleteTaskSpy = jest.spyOn(util, 'deleteTaskById');
const getAllTasksByUserSpy = jest.spyOn(util, 'getAllTasksByUser');
const updateTaskDependencySpy = jest.spyOn(util, 'updateTask');
const getDependentTasksByIdSpy = jest.spyOn(util, 'getDependentTasksById');
const getTaskSpy = jest.spyOn(util, 'getTaskById');
const populateDocumentSpy = jest.spyOn(dbUtil, 'populateDocument');

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
      createTaskSpy.mockResolvedValueOnce({ error: 'Error creating a task' });

      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when creating a task:');
    });

    it('should return the created task (empty arrays)', async () => {
      const mockRepsonse: PopulatedDatabaseTask = {
        ...databaseTask,
        dependentTasks: [],
        prereqTasks: [],
        relevantQuestions: [],
      };
      createTaskSpy.mockResolvedValue(databaseTask);
      populateDocumentSpy.mockResolvedValue(mockRepsonse);
      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.body._id).toEqual(mockRepsonse._id.toString());
      expect(response.status).toBe(201);
    });

    it('should return the created task (populated arrays)', async () => {
      const mockResponse: PopulatedDatabaseTask = {
        ...databaseTaskWithDependency,
        dependentTasks: [databaseTaskWithPrereq],
        prereqTasks: [],
        relevantQuestions: [],
      };
      createTaskSpy.mockResolvedValue(databaseTaskWithAllFields);
      populateDocumentSpy.mockResolvedValue(mockResponse);
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
      getAllTasksByUserSpy.mockResolvedValueOnce([{ error: 'Error getting task by user' }]);

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

  describe('DELETE /deleteTask', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 404 if the request pathing is invalid', async () => {
      const response = await supertest(app).delete('/task/deleteTask/');
      expect(response.status).toBe(404);
    });

    it('should return 500 if there is an error', async () => {
      deleteTaskSpy.mockResolvedValueOnce({ error: 'Error deleting task' });
      const response = await supertest(app).delete('/task/deleteTask/test');
      expect(response.status).toBe(500);
    });

    it('should return the deleted task', async () => {
      deleteTaskSpy.mockResolvedValue(databaseTask);
      const response = await supertest(app).delete('/task/deleteTask/test');
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(200);
    });
  });
  describe('PUT /updateTask', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).put('/task/updateTask').send({
        assignedUser: 'user123',
      });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request');
    });

    it('should return 500 if there is an error', async () => {
      updateTaskDependencySpy.mockResolvedValueOnce({ error: 'Error updating task' });

      const response = await supertest(app)
        .put('/task/updateTask')
        .send({ taskId: 'testId', updates: {} });
      expect(response.status).toBe(500);
    });

    it('should return the updated task', async () => {
      const mockResponse: PopulatedDatabaseTask = {
        ...databaseTask,
        dependentTasks: [],
        prereqTasks: [],
        relevantQuestions: [],
      };

      updateTaskDependencySpy.mockResolvedValue(databaseTask);
      populateDocumentSpy.mockResolvedValue(mockResponse);
      const response = await supertest(app)
        .put('/task/updateTask')
        .send({ taskId: 'testId', updates: {} });
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /getTask', () => {
    it('should return 500 if there is an error', async () => {
      getTaskSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).get('/task/getTask/aa');
      expect(response.status).toBe(500);
    });
    it('should return the sprint', async () => {
      // Mock the service calls
      getTaskSpy.mockResolvedValue(databaseTask);

      // Invoke the endpoint
      const response = await supertest(app).get(`/task/getTask/${databaseTask._id}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(getTaskSpy).toHaveBeenCalledWith(databaseTask._id.toString());

      // Convert ObjectIds and Dates for comparison
      expect(response.body).toMatchObject(JSON.parse(JSON.stringify(databaseTask)));
    });
  });
});
