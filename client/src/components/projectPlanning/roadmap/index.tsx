import { Alert, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseSprint, PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import RoadmapGraph from '../components/Roadmap/RoadmapGraph';
import { RoadmapGraphProps } from '../../../types/clientTypes/task';
import { clearErrorMessage } from '../../../redux/errorReducer/errorReducer';

export default function RoadmapGraphPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { project } = useSelector((state: any) => state.projectReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { errorMessage } = useSelector((state: any) => state.errorReducer);
  const [activeSprint, setActiveSprint] = useState<PopulatedDatabaseSprint | null>(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!project) {
      navigate('/project/sprint-planning');
    }
  }, [navigate, project]);

  useEffect(() => {
    if (project && project.sprints.length > 0) {
      const currentSprint = project.sprints.find(
        (sprint: PopulatedDatabaseSprint) => sprint.status === 'In Progress',
      );
      if (currentSprint) {
        setActiveSprint(currentSprint);
      }
    }
  }, [activeSprint, project]);

  if (!project) {
    return null;
  }
  console.log('Project:', project);
  console.log('Sprints:', project.sprints);
  if (project.sprints.length === 0) {
    return (
      <div className='p-3'>
        <h1 className='text-center'>
          No Sprints Available. Please create sprints in Sprint Planning.
        </h1>
      </div>
    );
  }

  if (project && project.sprints.length !== 0) {
    const activeSprintIndex = project.sprints.findIndex(
      (sprint: PopulatedDatabaseSprint) => sprint.status === 'In Progress',
    );
    if (activeSprintIndex === -1) {
      return (
        <div className='p-3'>
          <h2 className='text-center text-muted'>
            No Active Sprint Available. Please start a sprint in Sprint Planning.
          </h2>
        </div>
      );
    }
  }

  return (
    <div className='p-3'>
      <h1 className='text-2x1 font-bold mb-3'>Task Dependency Roadmap</h1>

      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      {activeSprint && <RoadmapGraph tasks={activeSprint.tasks as PopulatedDatabaseTask[]} />}
    </div>
  );
}
