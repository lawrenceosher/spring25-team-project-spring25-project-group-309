import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../../app';
import * as util from '../../services/task.service';
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
      createTaskSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when creating a task:');
    });

    it('should return the created task (empty arrays)', async () => {
      createTaskSpy.mockResolvedValue(databaseTask);
      const response = await supertest(app).post('/task/createTask').send(databaseTask);
      expect(response.body).toEqual(mockTaskResponse);
      expect(response.status).toBe(201);
    });

    it('should return the created task (populated arrays)', async () => {
      createTaskSpy.mockResolvedValue(databaseTaskWithAllFields);
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

  describe('PUT /updateTaskDependency', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app)
        .put('/task/updateTaskDependency')
        .send({ taskId: 'test' });
      expect(response.status).toBe(400);
    });
    it('should return 500 if there is an error', async () => {
      updateTaskDependencySpy.mockImplementation(() => {
        throw new Error('Test error');
      });
      const response = await supertest(app)
        .put('/task/updateTaskDependency')
        .send({ taskId: 'test', dependentTaskIds: ['testTask'] });
      expect(response.status).toBe(500);
    });
    it('should return the updated task', async () => {
      updateTaskDependencySpy.mockResolvedValue(databaseTask);
      const response = await supertest(app)
        .put('/task/updateTaskDependency')
        .send({ taskId: 'test', dependentTaskIds: ['testTask'] });
      expect(response.body).toEqual(mockTaskResponse);
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
      const error = new Error('Test error');
      deleteTaskSpy.mockRejectedValue(error);
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
});
