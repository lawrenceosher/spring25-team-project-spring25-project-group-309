import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const projectController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const createProject = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getProject = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
  return router;
};

export default projectController;
