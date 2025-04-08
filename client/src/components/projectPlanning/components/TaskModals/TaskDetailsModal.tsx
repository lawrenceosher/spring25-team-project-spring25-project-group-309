/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';
import { updateTask } from '../../../../services/taskService';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { setProject, updateTaskInProject } from '../../../../redux/projectReducer/projectReducer';
import { getProjectsByUser } from '../../../../services/projectService';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';
import TaskUpdateForm from '../TaskUpdateForm/TaskUpdateForm';
import TaskDetailsCard from '../TaskDetailsCard/TaskDetailsCard';

export default function TaskDetailsModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );

  const [isEditing, setIsEditing] = useState(false);

  const [taskToUpdate, setTaskToUpdate] = useState<DatabaseClientTask>({ ...selectedTask });

  useEffect(() => {
    if (selectedTask) {
      setTaskToUpdate({ ...selectedTask });
    }
  }, [selectedTask]);

  const dispatch = useDispatch();

  const handleUpdateTask = async (task: DatabaseClientTask) => {
    try {
      const updatedTask = await updateTask(task._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: task._id.toString(), updatedTask }));
      dispatch(setSelectedTask({ ...taskToUpdate }));
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
    <Modal show={show} onHide={handleClose}>
      {isEditing ? (
        <div className='p-3'>
          <TaskUpdateForm taskToUpdate={taskToUpdate} setTaskToUpdate={setTaskToUpdate} />
        </div>
      ) : (
        <TaskDetailsCard isEditing={isEditing} setIsEditing={setIsEditing} />
      )}

      <Modal.Footer>
        {isEditing && (
          <>
            <Button
              variant='primary'
              onClick={() => {
                setIsEditing(false);
              }}>
              Stop Editing
            </Button>
            <Button
              variant='success'
              onClick={() => {
                handleUpdateTask(taskToUpdate);
                setIsEditing(false);
              }}>
              Update Task
            </Button>
          </>
        )}
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
