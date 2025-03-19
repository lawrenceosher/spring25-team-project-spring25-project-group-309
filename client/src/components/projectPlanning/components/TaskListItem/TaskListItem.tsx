import { ListGroupItem } from 'react-bootstrap';
import { getStatusColor } from '../../../../tool';
import './TaskListItem.css';

export default function TaskListItem({
  taskName,
  taskStatus,
  taskPoints,
}: {
  taskName: string;
  taskStatus: string;
  taskPoints: number;
}) {
  return (
    <ListGroupItem className='d-flex align-items-center'>
      <div id='task-name-label' className='flex-grow-1'>
        {taskName}
      </div>
      <div className='d-flex justify-content-end flex-grow-1'>
        <span className={`p-2 rounded-pill fs-6 me-1 ${getStatusColor(taskStatus)}`}>
          {taskStatus}
        </span>
        <span className='bg-primary-subtle p-2 rounded-pill fs-6'>{taskPoints}</span>
      </div>
    </ListGroupItem>
  );
}
