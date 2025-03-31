/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import KanbanBoardHeader from '../components/KanbanBoardHeader/KanbanBoardHeader';
import ProgressColumn from '../components/ProgressColumn/ProgressColumn';
import BacklogColumn from '../components/ProgressColumn/BacklogColumn';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCompletionModal from '../components/SprintModals/SprintCompletionModal';
import useKanbanBoardPage from '../../../hooks/useKanbanBoardPage';

export default function KanbanBoardPage() {
  const { project } = useSelector((state: any) => state.projectReducer);

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

  if (!project) {
    return null;
  }

  return (
    <div className='p-3'>
      <KanbanBoardHeader
        project={project}
        handleShowCreateTaskModal={handleShowCreateTaskModal}
        handleShowCompleteSprintModal={handleShowCompleteSprintModal}
      />

      {/* <TaskCreationModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        project={project}
        setProject={setProject}
      /> */}

      <SprintCompletionModal
        show={showCompleteSprintModal}
        handleClose={handleCloseCompleteSprintModal}
      />

      <Container className='bg-transparent mt-3' fluid>
        <Row>
          <BacklogColumn projectBacklog={project.backlogTasks} />

          {/* Progress Columns */}
          {progressColumns.map((status: string) => (
            <ProgressColumn key={status} sprint={project.sprints[0]} column={status} />
          ))}
        </Row>
      </Container>
    </div>
  );
}
