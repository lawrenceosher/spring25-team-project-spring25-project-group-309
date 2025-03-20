/* eslint-disable import/no-extraneous-dependencies */
import './index.css';
import TaskCreationModal from '../components/TaskCreationModal/TaskCreationModal';
import SprintCreationModal from '../components/SprintCreationModal/SprintCreationModal';
import TaskDeletionModal from '../components/TaskCreationModal/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintCreationModal/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import useSprintPlanningPage from '../../../hooks/useSprintPlanningPage';
import TaskDetailsCard from '../components/TaskDetailsCard/TaskDetailsCard';
import SprintPlanningHeader from '../components/SprintPlanningHeader/SprintPlanningHeader';
import Backlog from '../components/Backlog/Backlog';
import { MockTask } from '../../../types/mockTypes/task';

export default function SprintPlanningPage() {
  const {
    project,
    setProject,
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

  const addTaskToSprint = (newTask: MockTask) => {
    setProject(prevProject => {
      const updatedSprints = prevProject.sprints.map(sprint => {
        if (sprint._id === newTask.sprint) {
          sprint.tasks.push(newTask);
        }
        return sprint;
      });

      return { ...prevProject, sprints: updatedSprints };
    });
  };

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
        addTaskToSprint={addTaskToSprint}
        project={project}
      />
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

      {/* Sprints and Backlog */}
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
