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
  const res = await api.get(`${SPRINT_API_URL}/getSprint`, { data: { sprintId } });

  if (res.status !== 200) {
    throw new Error('Error when fetching sprint');
  }

  return res.data;
};

export const deleteSprint = async (sprintId: string): Promise<PopulatedDatabaseSprint> => {
  const res = await api.delete(`${SPRINT_API_URL}/deleteSprint`, { data: { sprintId } });

  if (res.status !== 200) {
    throw new Error('Error when deleting sprint');
  }

  return res.data;
};

export const startSprint = async (sprintId: string): Promise<PopulatedDatabaseSprint> => {
  const res = await api.put(`${SPRINT_API_URL}/startSprint`, { sprintId });

  if (res.status !== 200) {
    throw new Error('Error when starting sprint');
  }

  return res.data;
};

export const endSprint = async (sprintId: string): Promise<PopulatedDatabaseSprint> => {
  const res = await api.put(`${SPRINT_API_URL}/endSprint`, { sprintId });

  if (res.status !== 200) {
    throw new Error('Error when ending sprint');
  }

  return res.data;
};

export const updateSprint = async (
  sprintId: string,
  updatedSprint: Sprint,
): Promise<PopulatedDatabaseSprint> => {
  const res = await api.put(`${SPRINT_API_URL}/updateSprint`, { sprintId, updates: updatedSprint });

  if (res.status !== 200) {
    throw new Error('Error when updating sprint');
  }

  return res.data;
};
