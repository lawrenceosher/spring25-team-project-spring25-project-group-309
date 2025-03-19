import { ListGroupItem } from 'react-bootstrap';
import { getStatusColor } from '../../../../tool';

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
    <ListGroupItem>
      <span>{taskName}</span>
      <div className='float-end'>
        <span className={`p-2 rounded-pill fs-6 me-1 ${getStatusColor(taskStatus)}`}>
          {taskStatus}
        </span>
        <span className='bg-primary-subtle p-2 rounded-pill fs-6'>{taskPoints}</span>
      </div>
    </ListGroupItem>
  );
}
