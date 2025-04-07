/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';
import { setProject, updateTaskInProject } from '../../../../redux/projectReducer/projectReducer';
import { updateTask, getTask } from '../../../../services/taskService';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { getProjectsByUser } from '../../../../services/projectService';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';
import TaskUpdateForm from '../TaskUpdateForm/TaskUpdateForm';

export default function TaskUpdateModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );

  const [taskToUpdate, setTaskToUpdate] = useState<DatabaseClientTask>({ ...selectedTask });

  const dispatch = useDispatch();

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

  const handleUpdateTask = async (task: DatabaseClientTask) => {
    try {
      // 1. Ensure that every task in the new prereqTasks is finished.
      if (task.status === 'Done') {
        if (task.prereqTasks.some(prereqTask => prereqTask.status !== 'Done')) {
          dispatch(setErrorMessage('Cannot update task: All prerequisite tasks must be finished.'));
          return;
        }
      }

      // 2. Check that updating this task does not introduce any dependency cycles.
      const cycleExists = await checkForCycle(
        task._id.toString(),
        task.prereqTasks.map(ptask => ptask._id),
      );
      if (cycleExists) {
        dispatch(setErrorMessage('Cannot update task: Dependency cycle detected in prerequisites.'));
        return;
      }

      // If validations pass, proceed with the task update.
      const updatedTask = await updateTask(task._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: task._id.toString(), updatedTask }));
      dispatch(setSelectedTask(null));
      const updatedProject = await getProjectsByUser(taskToUpdate.assignedUser);
      dispatch(setProject(updatedProject[0]));
    } catch (error: any) {
      dispatch(setErrorMessage(error.message || 'Error updating task'));
    }
  };

  if (!selectedTask) {
    return null;
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskUpdateForm taskToUpdate={taskToUpdate} setTaskToUpdate={setTaskToUpdate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button
            variant='success'
            onClick={() => {
              handleUpdateTask(taskToUpdate);
              handleClose();
            }}>
            Update Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
