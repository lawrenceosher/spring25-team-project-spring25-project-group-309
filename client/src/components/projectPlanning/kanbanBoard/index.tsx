/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';
import KanbanBoardHeader from '../components/KanbanBoardHeader/KanbanBoardHeader';
import ProgressColumn from '../components/ProgressColumn/ProgressColumn';
import BacklogColumn from '../components/ProgressColumn/BacklogColumn';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCompletionModal from '../components/SprintModals/SprintCompletionModal';
import useKanbanBoardPage from '../../../hooks/useKanbanBoardPage';
import { clearErrorMessage } from '../../../redux/errorReducer/errorReducer';

export default function KanbanBoardPage() {
  const { project } = useSelector((state: any) => state.projectReducer);
  const { errorMessage } = useSelector((state: any) => state.errorReducer);
  const [activeSprint, setActiveSprint] = useState<PopulatedDatabaseSprint | null>(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    progressColumns,
    showCreateTaskModal,
    handleCloseCreateTaskModal,
    handleShowCreateTaskModal,
    showCompleteSprintModal,
    handleCloseCompleteSprintModal,
    handleShowCompleteSprintModal,
  } = useKanbanBoardPage();

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
      <KanbanBoardHeader
        sprint={activeSprint}
        handleShowCreateTaskModal={handleShowCreateTaskModal}
        handleShowCompleteSprintModal={handleShowCompleteSprintModal}
      />

      <TaskCreationModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        project={project}
      />

      <SprintCompletionModal
        activeSprint={activeSprint}
        show={showCompleteSprintModal}
        handleClose={handleCloseCompleteSprintModal}
      />

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      <Container className='bg-transparent mt-3' fluid>
        <Row>
          <BacklogColumn projectBacklog={project.backlogTasks} />

          {/* Progress Columns */}
          {progressColumns.map((status: string) => (
            <ProgressColumn key={status} sprint={activeSprint} column={status} />
          ))}
        </Row>
      </Container>
    </div>
  );
}
