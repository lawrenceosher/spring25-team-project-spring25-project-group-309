import { PopulatedDatabaseSprint, Sprint } from '@fake-stack-overflow/shared';
import api from './config';

const SPRINT_API_URL = `${process.env.REACT_APP_SERVER_URL}/sprint`;

export const createSprint = async (newSprint: Sprint): Promise<PopulatedDatabaseSprint> => {
  const res = await api.post(`${SPRINT_API_URL}/createSprint`, newSprint);

  if (res.status !== 201) {
    throw new Error('Error when creating sprint');
  }

  return res.data;
};

export const getSprint = async (sprintId: string): Promise<PopulatedDatabaseSprint> => {
  const res = await api.get(`${SPRINT_API_URL}/getSprint`);

  if (res.status !== 200) {
    throw new Error('Error when fetching sprint');
  }

  return res.data;
};
