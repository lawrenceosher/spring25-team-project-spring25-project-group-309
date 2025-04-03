import ProjectModel from '../../models/project.model';
import { getAllProjectsByUser } from '../../services/project.service';
import { databaseProject } from '../mockData.models';

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
});
