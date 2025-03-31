import { PopulatedDatabaseTask, Task } from '@fake-stack-overflow/shared';
import api from './config';

const TASK_API_URL = `${process.env.REACT_APP_SERVER_URL}/task`;

export const createTask = async (newTask: Task): Promise<PopulatedDatabaseTask> => {
  const res = await api.post(`${TASK_API_URL}/createTask`, newTask);

  if (res.status !== 201) {
    throw new Error('Error when creating task');
  }

  return res.data;
};

export const getTasksByUser = async (username: string): Promise<Task[]> => {
  const res = await api.get(`${TASK_API_URL}/getTasks/${username}`);

  if (res.status !== 200) {
    throw new Error(`Error when fetching tasks for user: ${username}`);
  }

  return res.data;
};
