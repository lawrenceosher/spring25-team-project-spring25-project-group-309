/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner } from 'react-bootstrap';
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { PopulatedDatabaseSprint, Project } from '../../../types/types';
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
import { setProject, updateTaskInProject } from '../../../redux/projectReducer/projectReducer';
import { clearErrorMessage, setErrorMessage } from '../../../redux/errorReducer/errorReducer';
import { DatabaseClientTask } from '../../../types/clientTypes/task';
import { updateTask } from '../../../services/taskService';

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
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );
  const { errorMessage } = useSelector((state: any) => state.errorReducer);

  const { userList } = useUsersListPage();
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUserContext();
  const [sprintForModal, setSprintForModal] = useState<PopulatedDatabaseSprint | null>(null);
  const [taskForModal, setTaskForModal] = useState<DatabaseClientTask | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    assignedUsers: [],
    description: '',
    name: '',
    sprints: [],
    backlogTasks: [],
  });
  const dispatch = useDispatch();

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(mouseSensor);

  const handleCreateProject = async (proj: Project) => {
    try {
      const result = await createProject(proj);
      dispatch(setProject(result));
    } catch (error) {
      dispatch(setErrorMessage(`Error creating project`));
    }
  };

  const handleTaskUpdateOnDragEnd = async (event: any) => {
    const taskId = event.active.id;

    const correspondingTask = [
      ...project.sprints.flatMap((sprint: PopulatedDatabaseSprint) => sprint.tasks),
      ...project.backlogTasks,
    ].find((task: any) => task._id === taskId);

    if (!correspondingTask) {
      return;
    }

    if (event.over && event.over.id === 'Backlog') {
      if (!correspondingTask.sprint) {
        // Already in the backlog, no need to update
        return;
      }

      const taskToUpdate: DatabaseClientTask = {
        ...correspondingTask,
        sprint: null,
      };
      const updatedTask = await updateTask(taskToUpdate._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: updatedTask._id.toString(), updatedTask }));
      const updatedProject = await getProjectsByUser(updatedTask.assignedUser);
      dispatch(setProject(updatedProject[0]));
    } else if (event.over && event.over.id !== 'Backlog') {
      if (correspondingTask.sprint === event.over.id) {
        // Already in the same sprint, no need to update
        return;
      }

      const taskToUpdate: DatabaseClientTask = {
        ...correspondingTask,
        sprint: event.over.id,
      };

      const updatedTask = await updateTask(taskToUpdate._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: updatedTask._id.toString(), updatedTask }));
      const updatedProject = await getProjectsByUser(updatedTask.assignedUser);
      dispatch(setProject(updatedProject[0]));
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

      <TaskUpdateModal show={showTaskUpdateModal} handleClose={handleCloseTaskUpdateModal} />
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
          <DndContext onDragEnd={handleTaskUpdateOnDragEnd} sensors={sensors}>
            {project.sprints.length === 0 ? (
              <div className='text-muted flex-fill fs-2 mb-2'>
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
          </DndContext>
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
