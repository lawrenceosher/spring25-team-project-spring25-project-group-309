import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';
import { getAllProjectsByUser } from '../services/project.service';

const projectController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getProjectsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const tasks = await getAllProjectsByUser(username);
      const errorTask = tasks.find(task => 'error' in task);
      if (errorTask) {
        throw new Error(`${errorTask}`);
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).send(`Error when getting a task by username: ${(error as Error).message}`);
    }
  };
  router.get('/:username', getProjectsByUser);
  return router;
};

export default projectController;
