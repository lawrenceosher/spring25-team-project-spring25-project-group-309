/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext } from '@dnd-kit/core';
import KanbanBoardHeader from '../components/KanbanBoardHeader/KanbanBoardHeader';
import ProgressColumn from '../components/ProgressColumn/ProgressColumn';
import BacklogColumn from '../components/ProgressColumn/BacklogColumn';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCompletionModal from '../components/SprintModals/SprintCompletionModal';
import useKanbanBoardPage from '../../../hooks/useKanbanBoardPage';
import { updateTaskStatus } from '../../../redux/projectReducer/projectReducer';

export default function KanbanBoardPage() {
  const { project } = useSelector((state: any) => state.projectReducer);
  const dispatch = useDispatch();

  const {
    progressColumns,
    showCreateTaskModal,
    handleCloseCreateTaskModal,
    handleShowCreateTaskModal,
    showCompleteSprintModal,
    handleCloseCompleteSprintModal,
    handleShowCompleteSprintModal,
  } = useKanbanBoardPage();

  function handleDragEnd(event: any) {
    if (event.over && event.over.id === progressColumns[1]) {
      const selectedTask = project.sprint[0].tasks.find(
        (task: any) => task._id === event.active.id,
      );
      dispatch(
        updateTaskStatus({
          task: selectedTask,
          newStatus: progressColumns[1],
        }),
      );
    }
  }

  return (
    <div className='p-3'>
      <KanbanBoardHeader
        project={project}
        handleShowCreateTaskModal={handleShowCreateTaskModal}
        handleShowCompleteSprintModal={handleShowCompleteSprintModal}
      />

      <TaskCreationModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        project={project}
      />

      <SprintCompletionModal
        show={showCompleteSprintModal}
        handleClose={handleCloseCompleteSprintModal}
      />

      <Container className='bg-transparent mt-3' fluid>
        <Row>
          <DndContext onDragEnd={handleDragEnd}>
            <BacklogColumn projectBacklog={project.backlog.tasks} />

            {/* Progress Columns */}
            {progressColumns.map((status: string) => (
              <ProgressColumn key={status} sprint={project.sprints[0]} column={status} />
            ))}
          </DndContext>
        </Row>
      </Container>
    </div>
  );
}
