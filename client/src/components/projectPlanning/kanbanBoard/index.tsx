/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import { Alert, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanBoardHeader from '../components/KanbanBoardHeader/KanbanBoardHeader';
import ProgressColumn from '../components/ProgressColumn/ProgressColumn';
import BacklogColumn from '../components/ProgressColumn/BacklogColumn';
import TaskCreationModal from '../components/TaskModals/TaskCreationModal';
import SprintCompletionModal from '../components/SprintModals/SprintCompletionModal';
import useKanbanBoardPage from '../../../hooks/useKanbanBoardPage';
import { clearErrorMessage } from '../../../redux/errorReducer/errorReducer';
import { setProject, updateTaskInProject } from '../../../redux/projectReducer/projectReducer';
import { getProjectsByUser } from '../../../services/projectService';
import { updateTask, getTask } from '../../../services/taskService';
import { DatabaseClientTask } from '../../../types/clientTypes/task';

export default function KanbanBoardPage() {
  const { project } = useSelector((state: any) => state.projectReducer);
  const { errorMessage } = useSelector((state: any) => state.errorReducer);
  const [activeSprint, setActiveSprint] = useState<PopulatedDatabaseSprint | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (project && project.sprints.length > 0) {
      const currentSprint = project.sprints.find(
        (sprint: PopulatedDatabaseSprint) => sprint.status === 'In Progress',
      );
      if (currentSprint) {
        setActiveSprint(currentSprint);
      }
    }
  }, [activeSprint, project]);

  if (!project) {
    return null;
  }

  if (project.sprints.length === 0) {
    return (
      <div className='p-3'>
        <h1 className='text-center'>
          No Sprints Available. Please create sprints in Sprint Planning.
        </h1>
      </div>
    );
  }

  if (project && project.sprints.length !== 0) {
    const activeSprintIndex = project.sprints.findIndex(
      (sprint: PopulatedDatabaseSprint) => sprint.status === 'In Progress',
    );
    if (activeSprintIndex === -1) {
      return (
        <div className='p-3'>
          <h2 className='text-center text-muted'>
            No Active Sprint Available. Please start a sprint in Sprint Planning.
          </h2>
        </div>
      );
    }
  }

  // Recursively checks if adding the currentTask as a dependency creates a cycle
  const hasDependencyCycle = async (targetId: string, currentTaskId: string): Promise<boolean> => {
    const currentTask = await getTask(currentTaskId);
    if (!currentTask) return false;

    // Check if the current task already depends on the target task
    if (currentTask.prereqTasks.map(id => id.toString()).includes(targetId)) {
      return true;
    }

    // Recursively check each prerequisite of the current task
    const cycleResults = await Promise.all(
      currentTask.prereqTasks.map(nextTaskId =>
        hasDependencyCycle(targetId, nextTaskId.toString()),
      ),
    );

    if (cycleResults.some(result => result)) {
      return true;
    }

    return false;
  };

  // Checks across all new prerequisites if a cycle exists for the current task
  const checkForCycle = async (taskId: string, prereqTaskIds: string[]): Promise<boolean> => {
    const results = await Promise.all(
      prereqTaskIds.map(prereqId => hasDependencyCycle(taskId, prereqId)),
    );
    if (results.some(result => result)) {
      return true;
    }
    return false;
  };

  const handleTaskUpdateOnDragEnd = async (event: any) => {
    const taskId = event.active.id;

    const correspondingTask = [
      ...(activeSprint?.tasks || []),
      ...(project.backlogTasks || []),
    ].find((task: any) => task._id === taskId);

    let taskToUpdate: DatabaseClientTask;

    if (event.over && event.over.id === 'Backlog') {
      if (!correspondingTask.sprint) {
        // Already in the backlog, no need to update
        return;
      }

      taskToUpdate = {
        ...activeSprint?.tasks.find((task: any) => task._id === taskId),
        sprint: null,
      };
      const updatedTask = await updateTask(taskToUpdate._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: updatedTask._id.toString(), updatedTask }));
      const updatedProject = await getProjectsByUser(updatedTask.assignedUser);
      dispatch(setProject(updatedProject[0]));
    } else if (event.over && event.over.id !== 'Backlog') {
      if (
        correspondingTask.sprint === activeSprint?._id &&
        correspondingTask.status === event.over.id
      ) {
        // Already in the same progress column, no need to update
        return;
      }

      if (correspondingTask.sprint) {
        taskToUpdate = {
          ...correspondingTask,
          status: event.over.id,
        };
      } else {
        taskToUpdate = {
          ...correspondingTask,
          sprint: activeSprint?._id.toString(),
          status: event.over.id,
        };
      }

      // Ensure that every task in the new prereqTasks is finished.
      if (taskToUpdate.status === 'Done') {
        if (taskToUpdate.prereqTasks.some(prereqTask => prereqTask.status !== 'Done')) {
          return;
        }
      }

      // Check that updating this task does not create a dependency cycles.
      const cycleExists = await checkForCycle(
        taskToUpdate._id.toString(),
        taskToUpdate.prereqTasks.map(ptask => ptask._id),
      );
      if (cycleExists) {
        return;
      }

      const updatedTask = await updateTask(taskToUpdate._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: updatedTask._id.toString(), updatedTask }));
      const updatedProject = await getProjectsByUser(updatedTask.assignedUser);
      dispatch(setProject(updatedProject[0]));
    }
  };

  return (
    <div className='p-3'>
      <KanbanBoardHeader
        sprint={activeSprint}
        handleShowCreateTaskModal={handleShowCreateTaskModal}
        handleShowCompleteSprintModal={handleShowCompleteSprintModal}
      />

      <TaskCreationModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        project={project}
      />

      <SprintCompletionModal
        activeSprint={activeSprint}
        show={showCompleteSprintModal}
        handleClose={handleCloseCompleteSprintModal}
      />

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant='danger' onClose={() => dispatch(clearErrorMessage())} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      )}

      <Container className='bg-transparent mt-3' fluid>
        <Row>
          <DndContext onDragEnd={handleTaskUpdateOnDragEnd} sensors={sensors}>
            <BacklogColumn projectBacklog={project.backlogTasks} />

            {/* Progress Columns */}
            {progressColumns.map((status: string) => (
              <ProgressColumn key={status} sprint={activeSprint} column={status} />
            ))}
          </DndContext>
        </Row>
      </Container>
    </div>
  );
}
