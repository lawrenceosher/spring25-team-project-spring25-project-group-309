/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { PopulatedDatabaseSprint, PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import RoadmapGraph from '../components/Roadmap/RoadmapGraph';
import RoadmapHeader from '../components/RoadmapHeader/RoadmapHeader';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import { clearErrorMessage } from '../../../redux/errorReducer/errorReducer';
import { setSelectedTask } from '../../../redux/selectTask/selectTaskReducer';
import { DatabaseClientTask } from '../../../types/clientTypes/task';

export default function RoadmapGraphPage() {
  const { project } = useSelector((state: any) => state.projectReducer);
  const { errorMessage } = useSelector((state: any) => state.errorReducer);
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );

  const [filteredTasks, updateFilteredTasks] = useState<PopulatedDatabaseTask[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setFilteredTasks = useCallback((tasks: PopulatedDatabaseTask[]) => {
    updateFilteredTasks(tasks);
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

  const projectUsers = useMemo(() => project?.assignedUsers ?? [], [project?.assignedUsers]);

  const handleTaskClick = useCallback(
    (taskId: string) => {
      const task = allTasks.find(t => t._id.toString() === taskId);
      if (task) dispatch(setSelectedTask(task));
    },
    [allTasks, dispatch],
  );

  if (!project) {
    return null;
  }

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
      {/* Header */}
      <RoadmapHeader
        projectName={project.name}
        sprints={project.sprints}
        users={projectUsers}
        allTasks={allTasks}
        setFilteredTasks={setFilteredTasks}
      />

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      {/* Conditionally render the roadmap graph if filteredTasks is empty */}
      <div className='d-flex gap-3 mt-3' style={{ contain: 'layout style' }}>
        <div className='flex-grow-1'>
          {filteredTasks.length === 0 ? (
            <div className='text-center text-muted fs-5 mt-4'>
              No tasks found for the selected sprint or user.
            </div>
          ) : (
            <RoadmapGraph tasks={filteredTasks} onTaskClick={handleTaskClick} />
          )}
        </div>

        {/* Task Details */}
        {selectedTask && (
          <div id='task-details' className='ms-3'>
            <TaskDetailsCard />
          </div>
        )}
      </div>
    </div>
  );
}
