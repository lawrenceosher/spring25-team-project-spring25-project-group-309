/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner } from 'react-bootstrap';
import { PopulatedDatabaseSprint, PopulatedDatabaseTask, Project } from '../../../types/types';
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
import CreateProjectForm from '../components/CreateProjectForm/CreateProjectForm';
import { setProject } from '../../../redux/projectReducer/projectReducer';
import { clearErrorMessage, setErrorMessage } from '../../../redux/errorReducer/errorReducer';

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

  const { project } = useSelector((state: any) => state.projectReducer);
  const { selectedTask } = useSelector((state: any) => state.selectTaskReducer);
  const { errorMessage } = useSelector((state: any) => state.errorReducer);

  const { userList } = useUsersListPage();
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUserContext();
  const [sprintForModal, setSprintForModal] = useState<PopulatedDatabaseSprint | null>(null);
  const [taskForModal, setTaskForModal] = useState<PopulatedDatabaseTask | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    assignedUsers: [],
    description: '',
    name: '',
    sprints: [],
    backlogTasks: [],
  });
  const dispatch = useDispatch();

  const handleCreateProject = async (proj: Project) => {
    try {
      const result = await createProject(proj);
      dispatch(setProject(result));
    } catch (error) {
      dispatch(setErrorMessage(`Error creating project`));
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const result = await getProjectsByUser(currentUser.username);
      dispatch(setProject(result[0]));
      setLoading(false);
    };

    fetchProject();
  }, [currentUser.username, dispatch]);

  if (!project) {
    return (
      <CreateProjectForm
        newProject={newProject}
        setNewProject={setNewProject}
        userList={userList}
        handleCreateProject={handleCreateProject}
      />
    );
  }

  if (loading)
    return (
      <Spinner
        animation='border'
        role='status'
        className='position-absolute top-50 start-50 translate-middle'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    );

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
        taskId={taskForModal?._id.toString() || ''}
      />
      <SprintDeletionModal
        show={showDeleteSprintModal}
        handleClose={handleCloseDeleteSprintModal}
        sprintTitle={sprintForModal?.name || ''}
        sprintId={sprintForModal?._id.toString() || ''}
      />

      <TaskUpdateModal
        show={showTaskUpdateModal}
        handleClose={handleCloseTaskUpdateModal}
        project={project}
      />
      <SprintUpdateModal
        show={showSprintUpdateModal}
        handleClose={handleCloseSprintUpdateModal}
        sprintToUpdate={sprintForModal}
      />

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      {/* Sprints and Backlog */}
      <div className='mt-4 d-flex'>
        <div id='sprints'>
          {project.sprints.length === 0 ? (
            <div className='text-muted flex-fill fs-2'>
              No sprints created yet. Click Create Sprint to begin sprint planning.
            </div>
          ) : (
            <div className='flex-fill'>
              {project.sprints.map((sprint: PopulatedDatabaseSprint) => (
                <SprintListGroup
                  key={sprint._id.toString()}
                  sprint={sprint}
                  handleShowSprintUpdateModal={handleShowSprintUpdateModal}
                  handleShowDeleteSprintModal={handleShowDeleteSprintModal}
                  setSprintForModal={setSprintForModal}
                />
              ))}
            </div>
          )}
          <Backlog backlog={project.backlogTasks} />
        </div>

        {/* Task Details */}
        {selectedTask && (
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
