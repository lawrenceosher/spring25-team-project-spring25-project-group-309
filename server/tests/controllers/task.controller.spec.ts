import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { app } from '../../app';
import * as util from '../../services/task.service';
import { databaseTask } from '../mockData.models';

const MOCK_TASK_RESPONSE = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
    assignedUser: 'user123',
    description: 'Complete the sprint task.',
    name: 'Task 1',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
    status: 'todo',
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

const mockTaskResponse = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
  assignedUser: 'user123',
  description: 'Complete the sprint task.',
  name: 'Task 1',
  sprint: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  status: 'todo',
  dependentTasks: [],
  prereqForTasks: [],
  project: new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
  priority: 'low',
  taskPoints: 5,
  relevantQuestions: [],
  createdAt: new Date('2023-11-18T09:24:00').toISOString(),
  updatedAt: new Date('2023-11-18T09:24:00').toISOString(),
};
const getAllTasksByUserSpy = jest.spyOn(util, 'getAllTasksByUser');
const addDependentTasksSpy = jest.spyOn(util, 'addDependentTasks');

describe('Test taskController', () => {
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
});
