import mongoose from 'mongoose';
import { before } from 'node:test';
import supertest from 'supertest';
import { data } from 'vis-network';
import * as projectService from '../../services/project.service';
import projectController from '../../controllers/project.controller';
import { databaseProject, databaseProjectwithAllFields } from '../mockData.models';
import { app } from '../../app';
import * as databaseUtil from '../../utils/database.util';

const getAllProjectsByUserSpy = jest.spyOn(projectService, 'getAllProjectsByUser');
const populateDocumentSpy = jest.spyOn(databaseUtil, 'populateDocument');
const saveProjectSpy = jest.spyOn(projectService, 'saveProject');
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
      populateDocumentSpy.mockResolvedValue(databaseProjectwithAllFields);

      const response = await supertest(app).get('/project/testUser');

      expect(response.body).toMatchObject([
        {
          ...databaseProjectwithAllFields,
          _id: databaseProject._id.toString(),
          sprints: [
            {
              ...databaseProjectwithAllFields.sprints[0],
              project: databaseProjectwithAllFields.sprints[0].project.toString(),
              _id: databaseProjectwithAllFields.sprints[0]._id.toString(),
              startDate: databaseProjectwithAllFields.sprints[0].startDate.toISOString(),
              endDate: databaseProjectwithAllFields.sprints[0].endDate.toISOString(),
              tasks: [
                {
                  ...databaseProjectwithAllFields.sprints[0].tasks[0],
                  _id: databaseProjectwithAllFields.sprints[0].tasks[0]._id.toString(),
                  project: databaseProjectwithAllFields.sprints[0].tasks[0].project.toString(),
                  sprint: databaseProjectwithAllFields.sprints[0].tasks[0].sprint.toString(),
                  createdAt:
                    databaseProjectwithAllFields.sprints[0].tasks[0].createdAt.toISOString(),
                  updatedAt:
                    databaseProjectwithAllFields.sprints[0].tasks[0].updatedAt.toISOString(),
                  prereqTasks: [
                    {
                      ...databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0],
                      project:
                        databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0].project.toString(),
                      sprint:
                        databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0].sprint.toString(),
                      prereqTasks: [
                        databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0].prereqTasks[0]._id.toString(),
                      ],
                      _id: databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0]._id.toString(),
                      createdAt:
                        databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0].createdAt.toISOString(),
                      updatedAt:
                        databaseProjectwithAllFields.sprints[0].tasks[0].prereqTasks[0].updatedAt.toISOString(),
                    },
                  ],
                  relevantQuestions: [
                    {
                      ...databaseProjectwithAllFields.sprints[0].tasks[0].relevantQuestions[0],
                      _id: databaseProjectwithAllFields.sprints[0].tasks[0].relevantQuestions[0]._id.toString(),
                      askDateTime:
                        databaseProjectwithAllFields.sprints[0].tasks[0].relevantQuestions[0].askDateTime.toISOString(),
                      answers: [
                        databaseProjectwithAllFields.sprints[0].tasks[0].relevantQuestions[0].answers[0]._id.toString(),
                      ],
                      tags: [
                        databaseProjectwithAllFields.sprints[0].tasks[0].relevantQuestions[0].tags[0]._id.toString(),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
      expect(getAllProjectsByUserSpy).toHaveBeenCalledWith('testUser');
      expect(populateDocumentSpy).toHaveBeenCalledWith(databaseProject._id.toString(), 'project');
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

  describe('createProject', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 200 status code and the created project', async () => {
      saveProjectSpy.mockResolvedValue(databaseProject);

      const response = await supertest(app).post('/project/createProject').send(databaseProject);

      expect(response.body).toMatchObject({
        ...databaseProject,
        _id: databaseProject._id.toString(),
        sprints: databaseProject.sprints.map(sprint => sprint.toString()),
        backlogTasks: databaseProject.backlogTasks.map(task => task.toString()),
      });
      expect(saveProjectSpy).toHaveBeenCalledWith({
        ...databaseProject,
        _id: databaseProject._id.toString(),
        sprints: databaseProject.sprints.map(sprint => sprint.toString()),
        backlogTasks: databaseProject.backlogTasks.map(task => task.toString()),
      });
      expect(response.status).toBe(200);
    });

    it('should return a 500 status code and an error message when an error occurs', async () => {
      saveProjectSpy.mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await supertest(app).post('/project/createProject').send(databaseProject);

      expect(response.status).toBe(500);
    });
  });
});
