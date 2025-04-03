/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';
import { setProject, updateTaskInProject } from '../../../../redux/projectReducer/projectReducer';
import { updateTask } from '../../../../services/taskService';
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

  const handleUpdateTask = async (task: DatabaseClientTask) => {
    try {
      const updatedTask = await updateTask(task._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: task._id.toString(), updatedTask }));
      dispatch(setSelectedTask(null));
      const updatedProject = await getProjectsByUser(taskToUpdate.assignedUser);
      dispatch(setProject(updatedProject[0]));
    } catch (error) {
      dispatch(setErrorMessage('Error updating task'));
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
