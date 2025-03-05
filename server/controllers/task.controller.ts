import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const taskController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getTaskRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const createTaskRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updateTaskRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const deleteTaskRoute = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
};

export default taskController;
