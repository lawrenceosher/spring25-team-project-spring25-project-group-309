import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';
import { getAllProjectsByUser } from '../services/project.service';

const projectController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getProjectsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const projects = await getAllProjectsByUser(username);
      const errorProject = projects.find(project => 'error' in projects);
      if (errorProject) {
        throw new Error(`${errorProject}`);
      }

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).send(`Error when getting a project by username: ${(error as Error).message}`);
    }
  };
  router.get('/:username', getProjectsByUser);
  return router;
};

export default projectController;
