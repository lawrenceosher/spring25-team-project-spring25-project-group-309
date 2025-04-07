import { ObjectId } from 'mongodb';
import ProjectModel from '../../models/project.model';
import SprintModel from '../../models/sprint.model';
import {
  addSprintToProject,
  deleteSprintById,
  getSprintbyId,
  saveSprint,
  updateSprint,
} from '../../services/sprint.service';
import { databaseSprint } from '../mockData.models';
import { DatabaseSprint } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Sprint model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('addSprintToProject', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('Should add a sprint to a project', async () => {
      const projectId = new ObjectId();
      const sprintId = new ObjectId();
      const project = {
        _id: projectId,
        name: 'Test Project',
        sprints: [],
        assignedUsers: [],
        backlogTasks: [],
      };
      const updatedProject = {
        ...project,
        sprints: [sprintId],
      };
      mockingoose(ProjectModel).toReturn(project, 'findOne');
      mockingoose(ProjectModel).toReturn(updatedProject, 'findOneAndUpdate');
      const result = await addSprintToProject(sprintId, projectId);
      expect(result).toEqual(updatedProject);
    });
    it('Should throw an error if project not found', async () => {
      const projectId = new ObjectId();
      const sprintId = new ObjectId();
      mockingoose(ProjectModel).toReturn(null, 'findById');
      const result = await addSprintToProject(sprintId, projectId);
      expect('error' in result).toBe(true);
    });
  });

  describe('getSprintById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('Return sprint when invoked', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'findOne');
      const updatedSprint = await getSprintbyId(databaseSprint._id.toString());
      if ('error' in updatedSprint) {
        throw new Error('Expected a sprint, got an error');
      }
      expect(updatedSprint._id).toEqual(databaseSprint._id);
    });

    it('Throw error when necessary', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOne');
      const updatedSprint = await getSprintbyId('test');
      expect('error' in updatedSprint).toBe(true);
    });
  });

  describe('deleteSprintById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('Return deleted sprint when invoked', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'findOneAndDelete');
      const updatedSprint = await deleteSprintById(databaseSprint._id.toString());
      if ('error' in updatedSprint) {
        throw new Error('Expected a sprint, got an error');
      }
      expect(updatedSprint._id).toEqual(databaseSprint._id);
    });

    it('Throw error when necessary', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOneAndDelete');
      const updatedSprint = await deleteSprintById('test');
      expect('error' in updatedSprint).toBe(true);
    });

    it('should throw an error if a database error while deleting', async () => {
      mockingoose(SprintModel).toReturn(new Error('Error deleting object'), 'findOneAndDelete');

      const deletedError = await deleteSprintById('test');

      expect('error' in deletedError).toBe(true);
    });
  });
  describe('saveSprint', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });
    it('should return the saved sprint when successfully saving', async () => {
      mockingoose(SprintModel).toReturn(databaseSprint, 'create');
      const result = (await saveSprint(databaseSprint)) as DatabaseSprint;
      expect(result.name).toEqual(databaseSprint.name);
      expect(result.project).toEqual(databaseSprint.project);
      expect(result.tasks).toEqual(databaseSprint.tasks);
    });
    it('should return an error if the sprint is not found', async () => {
      jest
        .spyOn(SprintModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));
      const result = await saveSprint(databaseSprint);
      expect('error' in result).toBe(true);
    });
  });

  describe('updateSprint', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated sprint when successfully updating', async () => {
      const updatedSprint = { ...databaseSprint, name: 'Updated Sprint' };
      mockingoose(SprintModel).toReturn(updatedSprint, 'findOneAndUpdate');
      const result = (await updateSprint(databaseSprint._id.toString(), {
        name: 'Updated Sprint',
      })) as DatabaseSprint;
      expect(result.name).toEqual(updatedSprint.name);
    });

    it('should return an error if the sprint is not found', async () => {
      mockingoose(SprintModel).toReturn(null, 'findOneAndUpdate');
      const result = await updateSprint('test', { name: 'Updated Sprint' });
      expect('error' in result).toBe(true);
    });
  });
});
