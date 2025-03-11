import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/types';

const taskController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const createTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getPrerequisiteTasks = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getDependentTasks = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updateTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const deleteTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };
};

export default taskController;
