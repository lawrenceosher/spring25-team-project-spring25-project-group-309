/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseProject, Project } from '@fake-stack-overflow/shared';
import { Button, Form } from 'react-bootstrap';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCreationModal from '../components/SprintModals/SprintCreationModal';
import TaskDeletionModal from '../components/TaskModals/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintModals/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPageModals from '../../../hooks/useSprintPlanningPageModals';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import SprintPlanningHeader from '../components/SprintPlanningHeader/SprintPlanningHeader';
import Backlog from '../components/Backlog/Backlog';
import { MockSprint } from '../../../types/mockTypes/sprint';
import { MockTask } from '../../../types/mockTypes/task';
import TaskUpdateModal from '../components/TaskModals/TaskUpdateModal';
import SprintUpdateModal from '../components/SprintModals/SprintUpdateModal';
import useUsersListPage from '../../../hooks/useUsersListPage';
import { createProject, getProjectByUser } from '../../../services/projectService';
import { setProject } from '../../../redux/projectReducer/projectReducer';
import useUserContext from '../../../hooks/useUserContext';

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
    showTaskUpdateModal,
    handleCloseTaskUpdateModal,
    handleShowTaskUpdateModal,
    showSprintUpdateModal,
    handleCloseSprintUpdateModal,
    handleShowSprintUpdateModal,
  } = useSprintPlanningPageModals();

  const { userList } = useUsersListPage();
  const { project } = useSelector((state: any) => state.projectReducer);
  const { user: currentUser } = useUserContext();
  const dispatch = useDispatch();
  // const [sprintForModal, setSprintForModal] = useState<MockSprint>(project.sprints[0]);
  const [taskForModal, setTaskForModal] = useState<MockTask | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    assignedUsers: [],
    description: '',
    name: '',
    sprints: [],
    backlogTasks: [],
  });

  const handleCreateProject = async (proj: Project) => {
    try {
      const result = await createProject(proj);
      dispatch(setProject(result));
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const result = await getProjectByUser(currentUser.username);
      dispatch(setProject(result));
    };

    fetchProject();
  }, [dispatch, project, currentUser.username]);

  if (!project) {
    return (
      <div className='p-3 d-flex flex-column justify-content-center align-items-center'>
        <h2 className='fw-bold'>Create Project</h2>
        <p className='text-muted'>
          Please create a project to start sprint planning and gain access to a Kanban Board and
          Project Roadmap to examine dependencies.
        </p>
        <Form className='mt-3'>
          <Form.Group controlId='projectName'>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Project Name'
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId='projectDescription'>
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Project Description'
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId='projectMembers'>
            <Form.Label>Project Members</Form.Label>
            <Form.Select
              multiple
              defaultValue={[]}
              onChange={e =>
                setNewProject({
                  ...newProject,
                  assignedUsers: Array.from(e.target.selectedOptions, option => option.value),
                })
              }>
              {userList.map(user => (
                <option key={user._id.toString()} value={user.username}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button className='mt-3' variant='success'>
            Create Project
          </Button>
        </Form>
      </div>
    );
  }

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
      {/* <SprintDeletionModal
        show={showDeleteSprintModal}
        handleClose={handleCloseDeleteSprintModal}
        sprintTitle={sprintForModal?.name || ''}
      /> */}

      <TaskUpdateModal
        show={showTaskUpdateModal}
        handleClose={handleCloseTaskUpdateModal}
        project={project}
      />
      {/* <SprintUpdateModal
        show={showSprintUpdateModal}
        handleClose={handleCloseSprintUpdateModal}
        sprintToUpdate={sprintForModal}
      /> */}

      {/* Sprints and Backlog */}
      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          {project.sprints.length === 0 ? (
            <p className='text-muted'>No sprints available.</p>
          ) : (
            <>
              {project.sprints.map((sprint: MockSprint) => (
                <SprintListGroup
                  key={sprint._id}
                  sprint={sprint}
                  handleShowSprintUpdateModal={handleShowSprintUpdateModal}
                  handleShowDeleteSprintModal={handleShowDeleteSprintModal}
                  // setSprintForModal={setSprintForModal}
                />
              ))}

              <Backlog backlog={project.backlogTasks} />

              {/* Task Details */}
              <div id='task-details' className='ms-3'>
                <TaskDetailsCard
                  handleShowDeleteTaskModal={handleShowDeleteTaskModal}
                  handleShowTaskUpdateModal={handleShowTaskUpdateModal}
                  setTaskForModal={setTaskForModal}
                />
              </div>
            </>
          )}
          {}
        </div>
      </div>
    </div>
  );
}
