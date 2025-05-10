/* eslint-disable import/no-extraneous-dependencies */
import { useDispatch } from 'react-redux';
import { ListGroupItem } from 'react-bootstrap';
import { useDraggable } from '@dnd-kit/core';
import { getStatusColor } from '../../../../tool';
import './TaskListItem.css';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { PopulatedDatabaseTask } from '../../../../types/types';

export default function TaskListItem({ task }: { task: PopulatedDatabaseTask }) {
  const dispatch = useDispatch();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id.toString(),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1,
      }
    : undefined;

  return (
    <ListGroupItem
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className='d-flex align-items-center'
      onClick={() => {
        dispatch(setSelectedTask({ ...task }));
      }}>
      <div id='task-name-label' className='flex-grow-1'>
        {task.name}
      </div>
      <div className='d-flex justify-content-end flex-grow-1'>
        <span className={`p-2 rounded-pill fs-6 me-1 ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className='bg-primary-subtle p-2 rounded-pill fs-6'>{task.taskPoints}</span>
      </div>
    </ListGroupItem>
  );
}
