import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const projectController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getProjectRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const createProjectRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updateProjectRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const deleteProjectRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
};

export default projectController;
