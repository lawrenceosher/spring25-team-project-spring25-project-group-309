import express, { Response } from 'express';
import {
  FakeSOSocket,
  TasksByUsernameRequest,
  TaskIdRequest,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../types/types';
import { deleteTaskById, getAllTasksByUser, saveTask, updateTask } from '../services/task.service';
import { populateDocument } from '../utils/database.util';

const taskController = (socket: FakeSOSocket) => {
  const router = express.Router();

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
        prereqTasks,
        project,
        priority,
        taskPoints,
        relevantQuestions,
      } = req.body;

      const newTask: Task = {
        assignedUser,
        description,
        name,
        sprint,
        status,
        dependentTasks: dependentTasks ?? [],
        prereqTasks: prereqTasks ?? [],
        project,
        priority,
        taskPoints,
        relevantQuestions: relevantQuestions ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedTask = await saveTask(newTask);

      if ('error' in savedTask) {
        throw new Error(savedTask.error);
      }

      const populatedTask = await populateDocument(savedTask._id.toString(), 'task');

      if ('error' in populatedTask) {
        throw new Error(populatedTask.error);
      }

      socket.emit('taskUpdate', {
        task: populatedTask,
        type: 'created',
      });

      res.status(201).json(populatedTask);
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

  /**
   * Deletes a task by its ID.
   * @param req The request containing the task ID.
   * @param res The deleted task.
   */
  const deleteTask = async (req: TaskIdRequest, res: Response): Promise<void> => {
    const { taskId } = req.params;

    try {
      const deletedTask = await deleteTaskById(taskId);

      if ('error' in deletedTask) {
        throw new Error(deletedTask.error);
      }

      socket.emit('taskUpdate', {
        task: deletedTask,
        type: 'deleted',
      });

      res.json(deletedTask);
    } catch (err: unknown) {
      res.status(500).send(`Error when deleting a task: ${(err as Error).message}`);
    }
  };

  /**
   * Updates the dependencies of a task.
   * @param req The request containing the task ID and dependent task IDs.
   * @param res The updated task.
   */
  const updateTaskFields = async (req: UpdateTaskRequest, res: Response): Promise<void> => {
    if (!req.body.taskId || !req.body.updates) {
      res.status(400).send('Invalid request');
      return;
    }
    const { taskId, updates } = req.body;
    try {
      const updatedTask = await updateTask(taskId, { ...updates });
      if ('error' in updatedTask) {
        throw new Error(updatedTask.error);
      }

      const populatedTask = await populateDocument(updatedTask._id.toString(), 'task');
      if ('error' in populatedTask) {
        throw new Error(populatedTask.error);
      }

      socket.emit('taskUpdate', {
        task: populatedTask,
        type: 'updated',
      });
      res.json(populatedTask);
    } catch (error) {
      res.status(500).send(`Error when updating a task: ${(error as Error).message}`);
    }
  };

  router.post('/createTask', createTask);
  router.get('/getTaskByUser/:username', getTasksByUser);
  router.put('/updateTask', updateTaskFields);
  router.delete('/deleteTask/:taskId', deleteTask);
  return router;
};

export default taskController;
