import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../../app';
import * as util from '../../services/sprint.service';
import { databaseSprint } from '../mockData.models';

const addTasksToSprintSpy = jest.spyOn(util, 'addTasksToSprint');

const mockSprintResponse = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
  endDate: new Date('2023-11-18T09:24:00').toISOString(),
  name: 'Test',
  project: new ObjectId('47e9b58310afe6e94fc2e9dc').toString(),
  startDate: new Date('2023-11-18T09:24:00').toISOString(),
  status: 'active',
  tasks: [
    new ObjectId('15e9b58310afe6e94fc6e6dc').toString(),
    new ObjectId('25e9b58910afe7e94fc6e6dc').toString(),
  ],
};

describe('Test sprintController', () => {
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
