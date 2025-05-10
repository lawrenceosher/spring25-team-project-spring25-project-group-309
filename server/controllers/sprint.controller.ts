import express, { Response, Request } from 'express';
import {
  FakeSOSocket,
  CreateSprintRequest,
  SprintRequest,
  UpdateStatusRequest,
  UpdateSprintRequest,
} from '../types/types';
import {
  saveSprint,
  getSprintbyId,
  deleteSprintById,
  updateSprint,
} from '../services/sprint.service';
import SprintModel from '../models/sprint.model';
import { populateDocument } from '../utils/database.util';

const sprintController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the given CreateSprintRequest object to ensure it contains all required fields.
   *
   * @param req The CreateSprintRequest object to validate.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isCreateSprintRequestValid = (req: CreateSprintRequest): boolean =>
    !!req.body.name &&
    !!req.body.project &&
    !!req.body.status &&
    !!req.body.startDate &&
    !!req.body.endDate;

  /**
   * Validates the given SprintRequest object to ensure it contains all required fields.
   *
   * @param req The SprintRequest object to validate.
   * @returns 'true' if the request is valid, otherwise 'false'.
   * */
  const isSprintRequestValid = (req: SprintRequest): boolean => !!req.body.sprintId;

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

      socket.emit('sprintUpdate', {
        sprint,
        type: 'created',
      });

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
      res.status(500).send(`Error retrieving sprint: ${(err as Error).message}`);
    }
  };

  /**
   * Updates the status (start & end a sprint) of a sprint with the given ID.
   * @param req The UpdateStatusRequest containing the sprint ID and new status.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const updateSprintStatus = async (req: UpdateStatusRequest, res: Response): Promise<void> => {
    const { sprintId, status } = req.body;

    try {
      const updatedSprint = await updateSprint(sprintId, { status: status.toString() });

      if ('error' in updatedSprint) {
        throw new Error(updatedSprint.error);
      }
      socket.emit('sprintUpdate', {
        sprint: updatedSprint,
        type: 'updated',
      });
      res.json(updatedSprint);
    } catch (err: unknown) {
      res.status(500).send(`Error when updating sprint status: ${(err as Error).message}`);
    }
  };

  /**
   * Starts a sprint with the given ID by updating its status to 'In Progress'.
   * @param req The SprintRequest containing the sprint ID.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const startSprint = async (req: SprintRequest, res: Response): Promise<void> => {
    if (!isSprintRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    // add status update to request
    req.body.status = 'In Progress';
    await updateSprintStatus(req, res);
  };

  /**
   * Ends a sprint with the given ID by updating its status to 'Done'.
   * @param req The SprintRequest containing the sprint ID.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns
   */
  const endSprint = async (req: SprintRequest, res: Response): Promise<void> => {
    if (!isSprintRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    // add status update to request
    req.body.status = 'Done';
    await updateSprintStatus(req, res);
  };

  const updateSprintFields = async (req: UpdateSprintRequest, res: Response): Promise<void> => {
    if (!req.body || !req.body.sprintId) {
      res.status(400).send('Invalid request');
      return;
    }
    const { sprintId, updates } = req.body;

    try {
      const updatedSprint = await updateSprint(sprintId, {
        ...updates,
      });

      if ('error' in updatedSprint) {
        throw new Error(updatedSprint.error);
      }
      socket.emit('sprintUpdate', {
        sprint: updatedSprint,
        type: 'updated',
      });

      res.json(updatedSprint);
    } catch (err: unknown) {
      res.status(500).send(`Error when updating a sprint: ${(err as Error).message}`);
    }
  };

  const deleteSprint = async (req: Request, res: Response): Promise<void> => {
    const { sprintId } = req.body;

    try {
      const deletedSprint = await deleteSprintById(sprintId);

      if ('error' in deletedSprint) {
        throw new Error(deletedSprint.error);
      }

      socket.emit('sprintUpdate', {
        sprint: deletedSprint,
        type: 'deleted',
      });

      res.status(200).json(deletedSprint);
    } catch (error) {
      res.status(500).send(`Error when deleting a sprint: ${error}`);
    }
  };

  router.post('/createSprint', createSprint);
  router.put('/updateSprint', updateSprintFields);
  router.get('/getSprint', getSprint);
  router.delete('/deleteSprint', deleteSprint);
  router.put('/startSprint', startSprint);
  router.put('/endSprint', endSprint);
  return router;
};

export default sprintController;
