import express, { Response, Request } from 'express';
import { FakeSOSocket, AddDependentsRequest, TasksByUsernameRequest } from '../types/types';
import { addDependentTasks, getAllTasksByUser } from '../services/task.service';

const taskController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const isAddDependentRequestValid = (req: AddDependentsRequest): boolean =>
    !!req.body.taskId && !!req.body.dependentTaskIds;

  const createTask = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
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

  const getDependentTasks = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send('Not implemented');
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

  router.get('/getTaskByUser/:username', getTasksByUser);
  router.put('/addDependentTasks', addDependentTasksToTicket);
  return router;
};

export default taskController;
