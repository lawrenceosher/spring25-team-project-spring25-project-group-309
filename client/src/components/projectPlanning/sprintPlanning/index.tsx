/* eslint-disable import/no-extraneous-dependencies */
import { Button, FormGroup, FormLabel, FormSelect, ListGroup } from 'react-bootstrap';
import './index.css';
import { useState } from 'react';
import TaskCreationModal from '../components/TaskCreationModal/TaskCreationModal';
import SprintCreationModal from '../components/SprintCreationModal/SprintCreationModal';
import TaskDeletionModal from '../components/TaskCreationModal/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintCreationModal/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPage from '../../../hooks/useSprintPlanningPage';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';

export default function SprintPlanningPage() {
  const { project, selectedTask } = useSprintPlanningPage();

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
      <div id='sprint-planning-header' className='d-flex align-items-center'>
        <h1 id='project-name-header' className='fw-bold d-flex'>
          {project.name} - Sprint Planning
        </h1>
        <div className='d-flex justify-content-end flex-grow-1'>
          <FormGroup className='d-inline-flex me-3 align-middle'>
            <div>
              <FormLabel>Filter by User:</FormLabel>
              {/* Insert list of users in the project here */}
              <FormSelect>
                <option value='User 1'>User 1</option>
                <option value='User 2'>User 2</option>
                <option value='User 3'>User 3</option>
              </FormSelect>
            </div>
          </FormGroup>
          <Button size='lg' className='me-2' onClick={handleShowCreateSprintModal}>
            + Create Sprint
          </Button>
          <Button size='lg' variant='success' onClick={handleShowCreateTaskModal}>
            + Create Task
          </Button>
        </div>
      </div>

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

      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          {project.sprints.map(sprint => (
            <SprintListGroup
              key={sprint._id}
              sprint={sprint}
              handleShowDeleteSprintModal={handleShowDeleteSprintModal}
            />
          ))}

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Backlog</span>
                <div className='float-end'>
                  <span className='bg-primary-subtle p-2 rounded-pill'>20</span>
                </div>
              </div>
              <ListGroup className='rounded-0'>
                <ListGroup.Item>
                  <span>Backlog Task 1</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>10</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 2</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 3</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div id='task-details' className='ms-3'>
          <TaskDetailsCard
            handleShowDeleteTaskModal={handleShowDeleteTaskModal}
            task={selectedTask}
          />
        </div>
      </div>
    </div>
  );
}
