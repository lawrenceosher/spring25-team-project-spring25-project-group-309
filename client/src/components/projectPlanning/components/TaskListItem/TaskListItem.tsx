import { ListGroupItem } from 'react-bootstrap';

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
        <span className='bg-danger-subtle p-2 rounded-pill fs-6 me-1'>{taskStatus}</span>
        <span className='bg-primary-subtle p-2 rounded-pill fs-6'>{taskPoints}</span>
      </div>
    </ListGroupItem>
  );
}
