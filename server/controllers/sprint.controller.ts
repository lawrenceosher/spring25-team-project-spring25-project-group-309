import express, { Response, Request } from 'express';
import { AddTaskToSprintRequest, FakeSOSocket } from '../types/types';
import { populateDocument } from '../utils/database.util';
import {
  getSprintbyId,
} from '../services/sprint.services';
import { get } from 'http';
import { addTasksToSprint } from '../services/sprint.service';

const sprintController = (socket: FakeSOSocket) => {
  const isAddTaskstoSprintRequestValid = (req: AddTaskToSprintRequest): boolean =>
    !!req.body.sprintId && !!req.body.taskIds;
  const router = express.Router();

  const createSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getTasksForSprint = async (req: Request, res: Response): Promise<void> => {
    const { sprintId } = req.params;
    
    try {
      const foundSprint = await getSprintbyId(sprintId);

      if ('error' in foundSprint) {
        throw new Error(foundSprint.error);
      }

      const populatedChat = await populateDocument(foundSprint._id.toString(), 'sprint');

      if ('error' in populatedChat) {
        throw new Error(populatedChat.error);
      }

      res.json(populatedChat);
    } catch (err: unknown) {
      res.status(500).send(`Error retrieving chat: ${(err as Error).message}`);
    }
  };

  const getSprints = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const updatedSprintTasks = async (req: AddTaskToSprintRequest, res: Response): Promise<void> => {
    if (!isAddTaskstoSprintRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { sprintId, taskIds } = req.body;

    try {
      const updatedSprint = await addTasksToSprint(sprintId, taskIds);

      if ('error' in updatedSprint) {
        throw new Error(updatedSprint.error);
      }

      // socket.emit('SprintUpdate', { tasks}); TODO: ADD SOCKET EMISSION HERE

      res.json(updatedSprint);
    } catch (err: unknown) {
      res
        .status(500)
        .send(`Error when updating a sprint with new tasks : ${(err as Error).message}`);
    }
  };

  const deleteSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  router.put('/addTasks', updatedSprintTasks);

  router.get('/:sprintId', getTasksForSprint);

  return router;
};

export default sprintController;
