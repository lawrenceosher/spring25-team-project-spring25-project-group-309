import { ListGroupItem } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import { useDraggable } from '@dnd-kit/core';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import TaskDetailsModal from '../TaskModals/TaskDetailsModal';

export default function TaskItemProgressColumn({ task }: { task: PopulatedDatabaseTask }) {
  const dispatch = useDispatch();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const handleClose = () => setShowTaskDetailsModal(false);
  const handleShow = () => setShowTaskDetailsModal(true);

  return (
    <>
      <TaskDetailsModal show={showTaskDetailsModal} handleClose={handleClose} />
      <ListGroupItem
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
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
