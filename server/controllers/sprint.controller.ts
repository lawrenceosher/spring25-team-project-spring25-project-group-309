import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const sprintController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getSprintRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const createSprintRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updateSprintRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const deleteSprintRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
};

export default sprintController;
