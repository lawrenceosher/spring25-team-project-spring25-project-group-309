/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import './index.css';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  PopulatedDatabaseProject,
  PopulatedDatabaseSprint,
  PopulatedDatabaseTask,
  Project,
} from '../../../types/types';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCreationModal from '../components/SprintModals/SprintCreationModal';
import TaskDeletionModal from '../components/TaskModals/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintModals/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPageModals from '../../../hooks/useSprintPlanningPageModals';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import SprintPlanningHeader from '../components/SprintPlanningHeader/SprintPlanningHeader';
import Backlog from '../components/Backlog/Backlog';
import TaskUpdateModal from '../components/TaskModals/TaskUpdateModal';
import SprintUpdateModal from '../components/SprintModals/SprintUpdateModal';
import useUsersListPage from '../../../hooks/useUsersListPage';
import { createProject, getProjectsByUser } from '../../../services/projectService';
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
  // const { project } = useSelector((state: any) => state.projectReducer);
  const [project, setProject] = useState<PopulatedDatabaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUserContext();
  // const [sprintForModal, setSprintForModal] = useState<MockSprint>(project.sprints[0]);
  const [taskForModal, setTaskForModal] = useState<PopulatedDatabaseTask | null>(null);
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
      setProject(result);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const result = await getProjectsByUser(currentUser.username);
      setProject(result[0]);
      setLoading(false);
    };

    fetchProject();
  }, []);

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
          <Button
            className='mt-3'
            variant='success'
            onClick={() => handleCreateProject(newProject)}>
            Create Project
          </Button>
        </Form>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;

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

      {/* <TaskUpdateModal
        show={showTaskUpdateModal}
        handleClose={handleCloseTaskUpdateModal}
        project={project}
      /> */}
      {/* <SprintUpdateModal
        show={showSprintUpdateModal}
        handleClose={handleCloseSprintUpdateModal}
        sprintToUpdate={sprintForModal}
      /> */}

      {/* Sprints and Backlog */}
      <div className='mt-4 d-flex'>
        {project.sprints.length === 0 ? (
          <div id='sprints' className='text-muted flex-fill fs-2'>
            No sprints created yet. Click Create Sprint to begin sprint planning.
          </div>
        ) : (
          <div id='sprints' className='flex-fill'>
            {project.sprints.map((sprint: PopulatedDatabaseSprint) => (
              <SprintListGroup
                key={sprint._id.toString()}
                sprint={sprint}
                handleShowSprintUpdateModal={handleShowSprintUpdateModal}
                handleShowDeleteSprintModal={handleShowDeleteSprintModal}
                // setSprintForModal={setSprintForModal}
              />
            ))}

            <Backlog backlog={project.backlogTasks} />
          </div>
        )}
        {/* Task Details */}
        {project.sprints.length !== 0 && (
          <div id='task-details' className='ms-3'>
            <TaskDetailsCard
              handleShowDeleteTaskModal={handleShowDeleteTaskModal}
              handleShowTaskUpdateModal={handleShowTaskUpdateModal}
              setTaskForModal={setTaskForModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
