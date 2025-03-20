/* eslint-disable import/no-extraneous-dependencies */
import './index.css';
import { useState } from 'react';
import TaskCreationModal from '../components/TaskCreationModal/TaskCreationModal';
import SprintCreationModal from '../components/SprintCreationModal/SprintCreationModal';
import TaskDeletionModal from '../components/TaskCreationModal/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintCreationModal/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPage from '../../../hooks/useSprintPlanningPage';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import SprintPlanningHeader from '../components/SprintPlanningHeader/SprintPlanningHeader';
import Backlog from '../components/Backlog/Backlog';

export default function SprintPlanningPage() {
  const { project } = useSprintPlanningPage();

  // Task Creation Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const handleCloseCreateTaskModal = () => setShowCreateTaskModal(false);
  const handleShowCreateTaskModal = () => setShowCreateTaskModal(true);

  // Sprint Creation Modal
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const handleCloseCreateSprintModal = () => setShowCreateSprintModal(false);
  const handleShowCreateSprintModal = () => setShowCreateSprintModal(true);

  // Sprint Deletion Modal
  const [showDeleteSprintModal, setShowDeleteSprintModal] = useState(false);
  const handleCloseDeleteSprintModal = () => setShowDeleteSprintModal(false);
  const handleShowDeleteSprintModal = () => setShowDeleteSprintModal(true);

  // Task Deletion Modal
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const handleCloseDeleteTaskModal = () => setShowDeleteTaskModal(false);
  const handleShowDeleteTaskModal = () => setShowDeleteTaskModal(true);

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
      <TaskCreationModal show={showCreateTaskModal} handleClose={handleCloseCreateTaskModal} />
      <SprintCreationModal
        show={showCreateSprintModal}
        handleClose={handleCloseCreateSprintModal}
      />
      <TaskDeletionModal
        show={showDeleteTaskModal}
        handleClose={handleCloseDeleteTaskModal}
        taskTitle='Task 1'
      />
      <SprintDeletionModal
        show={showDeleteSprintModal}
        handleClose={handleCloseDeleteSprintModal}
        sprintTitle='Sprint 1'
      />

      {/* Sprints */}
      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          {project.sprints.map(sprint => (
            <SprintListGroup
              key={sprint._id}
              sprint={sprint}
              handleShowDeleteSprintModal={handleShowDeleteSprintModal}
            />
          ))}

          <Backlog backlog={project.backlog} />
        </div>

        {/* Task Details */}
        <div id='task-details' className='ms-3'>
          <TaskDetailsCard handleShowDeleteTaskModal={handleShowDeleteTaskModal} />
        </div>
      </div>
    </div>
  );
}
