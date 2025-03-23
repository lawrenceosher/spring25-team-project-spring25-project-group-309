import express, { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  AddDependentsRequest,
  TasksByUsernameRequest,
  GetDependentsRequest,
  CreateTaskRequest,
} from '../types/types';
import {
  addDependentTasks,
  getAllTasksByUser,
  getDependentTasksById,
} from '../services/task.service';
import TaskModel from '../models/task.model';

const taskController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const isAddDependentRequestValid = (req: AddDependentsRequest): boolean =>
    !!req.body.taskId && !!req.body.dependentTaskIds;

  /**
   * Validates the given GetDependentsRequest object to ensure it contains all required fields.
   * @param req The GetDependentsRequest containing task data.
   * @returns 'true' if the request is valid; otherwise, 'false'.
   */
  const isGetDependentsRequestValid = (req: GetDependentsRequest): boolean => !!req.params.taskId;

  /**
   * Vaidates the given CreateTaskRequest object to ensure it contains all required fields.
   * @param req The CreateTaskRequest object to validate.
   * @returns 'true' if the request is valid; otherwise, 'false'.
   */
  const isCreateTaskRequestValid = (req: CreateTaskRequest): boolean =>
    !!req.body.assignedUser &&
    !!req.body.description &&
    !!req.body.name &&
    !!req.body.status &&
    !!req.body.priority &&
    !!req.body.project &&
    req.body.taskPoints !== undefined;

  /**
   * Creates a new task with the given details to be saved to the database.
   * @param req The CreateTaskRequest containing the task data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const createTask = async (req: CreateTaskRequest, res: Response): Promise<void> => {
    if (!isCreateTaskRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    try {
      const {
        assignedUser,
        description,
        name,
        sprint,
        status,
        dependentTasks,
        prereqForTasks,
        project,
        priority,
        taskPoints,
        relevantQuestions,
      } = req.body;

      const newTask = new TaskModel({
        assignedUser,
        description,
        name,
        sprint,
        status,
        dependentTasks: dependentTasks ?? [],
        prereqForTasks: prereqForTasks ?? [],
        project,
        priority,
        taskPoints,
        relevantQuestions: relevantQuestions ?? [],
      });

      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).send(`Error when creating a task: ${(error as Error).message}`);
    }
  };

  const getTasksByUser = async (req: TasksByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const tasks = await getAllTasksByUser(username);
      const errorTask = tasks.find(task => 'error' in task);
      if (errorTask) {
        throw new Error(`${errorTask}`);
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).send(`Error when getting a task by username: ${(error as Error).message}`);
    }
  };

  const getPrerequisiteTasks = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  const getDependentTasks = async (req: GetDependentsRequest, res: Response): Promise<void> => {
    if (!isGetDependentsRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    try {
      const { taskId } = req.params;

      const tasks = await getDependentTasksById(taskId);
      const error = tasks.find(task => 'error' in task);

      if (error) {
        throw new Error(`${error}`);
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).send(`Error when getting dependent tasks: ${(error as Error).message}`);
    }
  };

  const addDependentTasksToTicket = async (
    req: AddDependentsRequest,
    res: Response,
  ): Promise<void> => {
    if (!isAddDependentRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { taskId, dependentTaskIds } = req.body;

    try {
      const updatedTask = await addDependentTasks(taskId, dependentTaskIds);

      if ('error' in updatedTask) {
        throw new Error(updatedTask.error);
      }

      // socket.emit('TASKUpdate', { msg: msgFromDb }); TODO: ADD SOCKET EMISSION HERE

      res.json(updatedTask);
    } catch (err: unknown) {
      res
        .status(500)
        .send(`Error when adding dependent tasks to a ticket ${(err as Error).message}`);
    }
  };

  const deleteTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
  };

  router.post('/createTask', createTask);
  router.get('/getTaskByUser/:username', getTasksByUser);
  router.put('/addDependentTasks', addDependentTasksToTicket);
  router.get('/getDependentTasks/:taskId', getDependentTasks);
  return router;
};

export default taskController;
