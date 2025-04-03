import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../../../services/taskService';
import { removeTaskFromProject } from '../../../../redux/projectReducer/projectReducer';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';

export default function TaskDeletionModal({
  show,
  handleClose,
  taskTitle,
  taskId,
}: {
  show: boolean;
  handleClose: () => void;
  taskTitle: string;
  taskId: string;
}) {
  const dispatch = useDispatch();

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      dispatch(removeTaskFromProject({ taskId }));
      dispatch(setSelectedTask(null));
    } catch (error) {
      dispatch(setErrorMessage('Error deleting task'));
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task: {taskTitle}?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              handleDeleteTask();
              handleClose();
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
