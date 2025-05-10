import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';
import { getAllProjectsByUser, saveProject } from '../services/project.service';
import { populateDocument } from '../utils/database.util';

const projectController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = req.body;
      const result = await saveProject(project);
      if ('error' in result) {
        throw new Error(`${result.error}`);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when saving a project: ${(error as Error).message}`);
    }
  };

  const getProjectsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const projects = await getAllProjectsByUser(username);
      const errorProject = projects.find(project => 'error' in project);
      if (errorProject) {
        throw new Error(`${errorProject}`);
      }

      const populatedProjects = await Promise.all(
        projects.map(async project => {
          if ('error' in project) {
            return project;
          }
          const populatedProject = await populateDocument(project._id.toString(), 'project');
          return populatedProject;
        }),
      );
      const errorPopulatedProject = populatedProjects.find(project => 'error' in project);
      if (errorPopulatedProject) {
        throw new Error(`${errorPopulatedProject}`);
      }
      res.status(200).json(populatedProjects);
    } catch (error) {
      res.status(500).send(`Error when getting a project by username: ${(error as Error).message}`);
    }
  };
  router.get('/:username', getProjectsByUser);
  router.post('/createProject', createProject);
  return router;
};

export default projectController;
