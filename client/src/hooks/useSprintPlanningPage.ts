import { useState } from 'react';
import { MockProject } from '../types/mockTypes/project';
import { project1 } from '../mockData/mockData';

const useSprintPlanningPage = () => {
  const [project, setProject] = useState<MockProject>(project1);

  return { project, setProject };
};

export default useSprintPlanningPage;
