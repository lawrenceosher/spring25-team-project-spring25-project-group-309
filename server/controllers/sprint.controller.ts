import express, { Response, Request } from 'express';
import { AddTaskToSprintRequest, FakeSOSocket, CreateSprintRequest } from '../types/types';
import {
  saveSprint,
  addTasksToSprint,
  getSprintbyId,
  deleteSprintById,
  getSprintsByProjectId,
} from '../services/sprint.service';
import SprintModel from '../models/sprint.model';
import { populateDocument } from '../utils/database.util';

const sprintController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the given CreateSprintRequest object to ensure it contains all required fields.
   *
   * @param req The CreateSprintRequest object to validate.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isCreateSprintRequestValid = (req: CreateSprintRequest): boolean =>
    !!req.body.name &&
    !!req.body.project &&
    !!req.body.status &&
    !!req.body.startDate &&
    !!req.body.endDate;

  const isAddTaskstoSprintRequestValid = (req: AddTaskToSprintRequest): boolean =>
    !!req.body.sprintId && !!req.body.taskIds;

  /**
   * Creates a new sprint with the given details to be saved to the database. 'Tasks' is an optional field. Will return an empty array if not provided.
   *
   * @param req The CreateSprintRequest containing the sprint data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
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
    if (!req.body || !req.body.sprintId) {
      res.status(400).send('Invalid request');
      return;
    }

    const { sprintId } = req.body;

    try {
      const foundSprint = await getSprintbyId(sprintId);

      if ('error' in foundSprint) {
        throw new Error(foundSprint.error);
      }

      const populatedSprint = await populateDocument(foundSprint._id.toString(), 'sprint');

      if ('error' in populatedSprint) {
        throw new Error(populatedSprint.error);
      }

      res.json(populatedSprint);
    } catch (err: unknown) {
      res.status(500).send(`Error retrieving chat: ${(err as Error).message}`);
    }
  };

  const getSprints = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.body;

    try {
      const sprints = await getSprintsByProjectId(projectId);

      res.json(sprints);
    } catch (error) {
      res.status(500).send(`Error when getting sprints: ${error}`);
    }
  };

  const updateSprintTasks = async (req: AddTaskToSprintRequest, res: Response): Promise<void> => {
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
    const { sprintId } = req.body;

    try {
      const deletedSprint = await deleteSprintById(sprintId);

      res.status(200).json(deletedSprint);
    } catch (error) {
      res.status(500).send(`Error when deleting a sprint: ${error}`);
    }
  };

  router.post('/createSprint', createSprint);
  router.put('/addTasks', updateSprintTasks);
  router.get('/getSprint', getSprint);
  router.delete('/deleteSprint', deleteSprint);
  router.get('/getSprints', getSprints);
  return router;
};

export default sprintController;
