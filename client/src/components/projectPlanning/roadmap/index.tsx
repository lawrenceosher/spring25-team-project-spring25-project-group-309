/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { PopulatedDatabaseSprint, PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import RoadmapGraph from '../components/Roadmap/RoadmapGraph';
import RoadmapHeader from '../components/RoadmapHeader/RoadmapHeader';
import { clearErrorMessage } from '../../../redux/errorReducer/errorReducer';

export default function RoadmapGraphPage() {
  const { project } = useSelector((state: any) => state.projectReducer);
  const { errorMessage } = useSelector((state: any) => state.errorReducer);

  const [filteredTasks, setFilteredTasksState] = useState<PopulatedDatabaseTask[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setFilteredTasks = useCallback((tasks: PopulatedDatabaseTask[]) => {
    setFilteredTasksState(tasks);
  }, []);

  useEffect(() => {
    if (!project) {
      navigate('/project/sprint-planning');
    }
  }, [navigate, project]);

  const allTasks = useMemo(() => {
    const sprintTasks = (project?.sprints ?? []).flatMap((s: PopulatedDatabaseSprint) => s.tasks);
    const backlogTasks = (project?.backlogTasks ?? []) as PopulatedDatabaseTask[];
    return [...sprintTasks, ...backlogTasks];
  }, [project?.sprints, project?.backlogTasks]);

  useEffect(() => {
    if (allTasks.length > 0) {
      setFilteredTasks(allTasks);
    }
  }, [allTasks, setFilteredTasks]);

  // SAFELY EXTRACT USERS FROM POPULATED MEMBERS
  const projectUsers = useMemo(() => {
    if (!project?.members) return [];
    console.log('Project members:', project.members); // Debugging line
    return project.members
      .filter((m: any) => typeof m.username === 'string')
      .map((m: any) => m.username);
  }, [project?.members]);

  if (!project) return null;

  if (project.sprints.length === 0 && project.backlogTasks.length === 0) {
    return (
      <div className='p-3'>
        <h1 className='text-center'>
          No Sprints or Backlog Tasks Available. Please create tasks in Sprint Planning.
        </h1>
      </div>
    );
  }

  return (
    <div className='p-3'>
      <RoadmapHeader
        projectName={project.name}
        sprints={project.sprints}
        users={projectUsers}
        allTasks={allTasks}
        setFilteredTasks={setFilteredTasks}
      />

      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      <RoadmapGraph tasks={filteredTasks} />
    </div>
  );
}
