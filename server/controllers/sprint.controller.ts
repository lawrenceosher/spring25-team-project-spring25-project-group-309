import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const sprintController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const createSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getSprints = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updateSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const deleteSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
};

export default sprintController;
