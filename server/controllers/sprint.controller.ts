import express, { Response, Request } from 'express';
import { AddTaskToSprintRequest, FakeSOSocket, CreateSprintRequest } from '../types/types';
import { saveSprint, addTasksToSprint } from '../services/sprint.service';
import SprintModel from '../models/sprint.model';

const sprintController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const isCreateSprintRequestValid = (req: CreateSprintRequest): boolean =>
    !!req.body.name &&
    !!req.body.project &&
    !!req.body.status &&
    !!req.body.startDate &&
    !!req.body.endDate &&
    Array.isArray(req.body.tasks);

  const isAddTaskstoSprintRequestValid = (req: AddTaskToSprintRequest): boolean =>
    !!req.body.sprintId && !!req.body.taskIds;

  const createSprint = async (req: CreateSprintRequest, res: Response): Promise<void> => {
    if (!isCreateSprintRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    try {
      const { tasks, name, project, status, startDate, endDate } = req.body;

      const newSprint = new SprintModel({
        tasks: tasks ?? [],
        name,
        project,
        status,
        startDate,
        endDate,
      });

      const sprint = await saveSprint(newSprint);

      if ('error' in sprint) {
        throw new Error(sprint.error);
      }

      res.status(201).json(sprint);
    } catch (err: unknown) {
      res.status(500).send(`Error when creating a sprint: ${(err as Error).message}`);
    }
  };

  const getSprint = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
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

  router.post('/createSprint', createSprint);
  router.put('/addTasks', updatedSprintTasks);
  return router;
};

export default sprintController;
