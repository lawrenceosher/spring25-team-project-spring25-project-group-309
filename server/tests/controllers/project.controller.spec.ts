import mongoose from 'mongoose';
import { before } from 'node:test';
import supertest from 'supertest';
import * as projectService from '../../services/project.service';
import projectController from '../../controllers/project.controller';
import { databaseProject } from '../mockData.models';
import { app } from '../../app';

const getAllProjectsByUserSpy = jest.spyOn(projectService, 'getAllProjectsByUser');
const mockDataBaseProject = {
  _id: databaseProject._id.toString(),
  assignedUsers: databaseProject.assignedUsers,
  description: databaseProject.description,
  name: databaseProject.name,
  sprints: databaseProject.sprints.map(sprint => sprint.toString()),
  backlogTasks: databaseProject.backlogTasks.map(task => task.toString()),
};

describe('Project Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjectsByUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 200 status code and the projects for the given user', async () => {
      getAllProjectsByUserSpy.mockResolvedValue([databaseProject]);

      const response = await supertest(app).get('/project/testUser');

      expect(response.body).toEqual([mockDataBaseProject]);
      expect(response.status).toBe(200);
    });

    it('should return a 500 status code and an error message when an error occurs', async () => {
      getAllProjectsByUserSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).get('/project/testUser');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when getting a project by username: Test error');
    });
  });
});
