import { ListGroupItem } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { ClientTask } from '../../../../types/clientTypes/task';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import TaskDetailsModal from '../TaskModals/TaskDetailsModal';

export default function TaskItemProgressColumn({ task }: { task: ClientTask }) {
  const dispatch = useDispatch();

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const handleClose = () => setShowTaskDetailsModal(false);
  const handleShow = () => setShowTaskDetailsModal(true);

  return (
    <>
      <TaskDetailsModal show={showTaskDetailsModal} handleClose={handleClose} />
      <ListGroupItem
        className='d-flex align-items-center mb-2'
        onClick={() => {
          dispatch(setSelectedTask({ ...task }));
          handleShow();
        }}>
        <span className='flex-fill'>{task.name}</span>
        <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>
          {task.taskPoints}
        </span>
      </ListGroupItem>
    </>
  );
}
