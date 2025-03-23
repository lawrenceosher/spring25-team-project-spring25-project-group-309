import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { CreateSprintRequest } from '../../types/types';
import { app } from '../../app';
import * as util from '../../services/sprint.service';
import { databaseSprint } from '../mockData.models';

const createSprintSpy = jest.spyOn(util, 'saveSprint');
const addTasksToSprintSpy = jest.spyOn(util, 'addTasksToSprint');

const mockSprintResponse = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
  name: 'Test',
  project: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  startDate: new Date('2023-11-18T09:24:00').toISOString(),
  endDate: new Date('2023-11-18T09:24:00').toISOString(),
  status: 'active',
  tasks: [
    new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
    new ObjectId('25e9b58910afe7e94fc6e6dc').toString(),
  ],
};

const sprintNoTasksRequest = {
  name: 'Test',
  project: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  startDate: new Date('2023-11-18T09:24:00').toISOString(),
  endDate: new Date('2023-11-18T09:24:00').toISOString(),
  status: 'active',
};

const sprintNoTasksResponse = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  name: 'Test',
  project: new ObjectId('47e9b58310afe6e94fc2e9dc'),
  startDate: new Date('2023-11-18T09:24:00'),
  endDate: new Date('2023-11-18T09:24:00'),
  status: 'active',
  tasks: [],
};

describe('Test sprintController', () => {
  beforeEach(() => {
    createSprintSpy.mockClear();
    addTasksToSprintSpy.mockClear();
  });

  describe('POST /createSprint', () => {
    it('should return 400 if the CreateSprintRequest is invalid', async () => {
      const response1 = await supertest(app).post('/sprint/createSprint').send({ name: 'Test' });
      expect(response1.status).toBe(400);
    });

    it('should return 500 if there is an error', async () => {
      createSprintSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).post('/sprint/createSprint').send(databaseSprint);
      expect(response.status).toBe(500);
    });

    it('should return the created sprint', async () => {
      createSprintSpy.mockResolvedValue(databaseSprint);
      const response = await supertest(app).post('/sprint/createSprint').send(databaseSprint);
      expect(response.body).toEqual(mockSprintResponse);
      expect(response.status).toBe(201);
      expect(response.body.project.toString()).toBe(mockSprintResponse.project);
    });

    it('should return empty array if tasks are not provided', async () => {
      createSprintSpy.mockResolvedValue(sprintNoTasksResponse);
      const response = await supertest(app).post('/sprint/createSprint').send(sprintNoTasksRequest);
      expect(response.body.tasks).toEqual([]);
      expect(response.status).toBe(201);
    });
  });

  describe('PUT /addTasks', () => {
    it('should return 400 if the request is invalid', async () => {
      const response = await supertest(app).put('/sprint/addTasks').send({ sprintId: 'test' });
      expect(response.status).toBe(400);
    });

    it('should return 500 if there is an error', async () => {
      addTasksToSprintSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app)
        .put('/sprint/addTasks')
        .send({ sprintId: 'test', taskIds: ['testTask'] });
      expect(response.status).toBe(500);
    });

    it('should return the updated sprint', async () => {
      addTasksToSprintSpy.mockResolvedValue(databaseSprint);
      const response = await supertest(app)
        .put('/sprint/addTasks')
        .send({ sprintId: 'test', taskIds: ['testTask'] });
      expect(response.body).toEqual(mockSprintResponse);
      expect(response.status).toBe(200);
    });
  });
});
