import { ListGroupItem } from 'react-bootstrap';

export default function TaskItemProgressColumn({
  taskName,
  taskPoints,
}: {
  taskName: string;
  taskPoints: number;
}) {
  return (
    <ListGroupItem className='d-flex align-items-center mb-2'>
      <span className='flex-fill'>{taskName}</span>
      <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>{taskPoints}</span>
    </ListGroupItem>
  );
}
