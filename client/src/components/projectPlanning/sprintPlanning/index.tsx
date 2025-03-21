/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import './index.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCreationModal from '../components/SprintModals/SprintCreationModal';
import TaskDeletionModal from '../components/TaskModals/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintModals/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPage from '../../../hooks/useSprintPlanningPage';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import SprintPlanningHeader from '../components/SprintPlanningHeader/SprintPlanningHeader';
import Backlog from '../components/Backlog/Backlog';
import { MockSprint } from '../../../types/mockTypes/sprint';
import { MockTask } from '../../../types/mockTypes/task';

export default function SprintPlanningPage() {
  const {
    showCreateTaskModal,
    handleCloseCreateTaskModal,
    handleShowCreateTaskModal,
    showCreateSprintModal,
    handleCloseCreateSprintModal,
    handleShowCreateSprintModal,
    showDeleteSprintModal,
    handleCloseDeleteSprintModal,
    handleShowDeleteSprintModal,
    showDeleteTaskModal,
    handleCloseDeleteTaskModal,
    handleShowDeleteTaskModal,
  } = useSprintPlanningPage();

  const { project } = useSelector((state: any) => state.projectReducer);
  const [sprintForModal, setSprintForModal] = useState<MockSprint | null>(null);
  const [taskForModal, setTaskForModal] = useState<MockTask | null>(null);

  return (
    <div className='p-3'>
      {/* Header */}
      <SprintPlanningHeader
        projectName={project.name}
        users={project.assignedUsers}
        handleShowCreateSprintModal={handleShowCreateSprintModal}
        handleShowCreateTaskModal={handleShowCreateTaskModal}
      />

      {/* Modals */}
      <TaskCreationModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        project={project}
      />
      <SprintCreationModal
        show={showCreateSprintModal}
        handleClose={handleCloseCreateSprintModal}
        project={project}
      />

      <TaskDeletionModal
        show={showDeleteTaskModal}
        handleClose={handleCloseDeleteTaskModal}
        taskTitle={taskForModal?.name || ''}
      />
      <SprintDeletionModal
        show={showDeleteSprintModal}
        handleClose={handleCloseDeleteSprintModal}
        sprintTitle={sprintForModal?.name || ''}
      />

      {/* Sprints and Backlog */}
      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          {project.sprints.map((sprint: MockSprint) => (
            <SprintListGroup
              key={sprint._id}
              sprint={sprint}
              handleShowDeleteSprintModal={handleShowDeleteSprintModal}
              setSprintForModal={setSprintForModal}
            />
          ))}

          <Backlog backlog={project.backlog} />
        </div>

        {/* Task Details */}
        <div id='task-details' className='ms-3'>
          <TaskDetailsCard
            handleShowDeleteTaskModal={handleShowDeleteTaskModal}
            setTaskForModal={setTaskForModal}
          />
        </div>
      </div>
    </div>
  );
}
