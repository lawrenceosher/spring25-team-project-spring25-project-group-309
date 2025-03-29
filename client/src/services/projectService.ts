import { PopulatedDatabaseProject, Project } from '@fake-stack-overflow/shared';
import api from './config';

const PROJECT_API_URL = `${process.env.REACT_APP_SERVER_URL}/project`;

export const getProjectByUser = async (username: string): Promise<PopulatedDatabaseProject> => {
  const res = await api.get(`${PROJECT_API_URL}/${username}`);

  if (res.status !== 200) {
    throw new Error(`Error when fetching project for user: ${username}`);
  }

  return res.data;
};

export const createProject = async (newProject: Project): Promise<PopulatedDatabaseProject> => {
  const res = await api.post(`${PROJECT_API_URL}/createProject`, newProject);

  if (res.status !== 200) {
    throw new Error('Error when creating project');
  }

  return res.data;
};
