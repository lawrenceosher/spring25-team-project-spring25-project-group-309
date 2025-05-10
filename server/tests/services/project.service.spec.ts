import { DatabaseProject } from '../../types/types';
import ProjectModel from '../../models/project.model';
import { getAllProjectsByUser, saveProject, updateProject } from '../../services/project.service';
import { databaseProject, project } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Project model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getAllProjectsByUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the projects for the user', async () => {
      mockingoose(ProjectModel).toReturn(databaseProject, 'find');
      const projects = await getAllProjectsByUser('user1');
      expect(projects).toEqual(databaseProject);
    });

    it('should return an error message if no projects are found', async () => {
      mockingoose(ProjectModel).toReturn(null, 'find');
      const projects = await getAllProjectsByUser('user1');
      expect(projects).toEqual([{ error: 'Error when getting a project' }]);
    });
  });

  describe('saveProject', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved project', async () => {
      mockingoose(ProjectModel).toReturn(databaseProject, 'create');
      const savedProject = await saveProject(project);
      expect(savedProject).toMatchObject(project);
    });

    it('should return an error message if the project is not saved', async () => {
      mockingoose(ProjectModel).toReturn(null, 'create');
      jest.spyOn(ProjectModel, 'create').mockRejectedValueOnce(new Error('DB Error'));
      const savedProject = await saveProject(project);
      expect(savedProject).toEqual({ error: 'Error when saving a project' });
    });
  });
  describe('updateProject', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });
    afterEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated project', async () => {
      mockingoose(ProjectModel).toReturn(databaseProject, 'findOneAndUpdate');
      const updatedProject = (await updateProject(databaseProject._id.toString(), {
        name: 'Updated Project',
      })) as DatabaseProject;
      expect(updatedProject).toMatchObject(databaseProject);
    });

    it('should return an error message if the project is not updated', async () => {
      mockingoose(ProjectModel).toReturn(null, 'findOneAndUpdate');
      const updatedProject = await updateProject(databaseProject._id.toString(), {
        name: 'Updated Project',
      });
      expect(updatedProject).toEqual({ error: 'Error when updating a project' });
    });
  });
});
