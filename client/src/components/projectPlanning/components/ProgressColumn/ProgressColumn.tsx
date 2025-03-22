import { Col, ListGroup } from 'react-bootstrap';
import { MockSprint } from '../../../../types/mockTypes/sprint';
import TaskItemProgressColumn from './TaskItemProgressColumn';

export default function ProgressColumn({ sprint, column }: { sprint: MockSprint; column: string }) {
  const tasks = sprint.tasks.filter(task => task.status === column);
  return (
    <Col>
      <div className='rounded bg-secondary-subtle p-2'>
        <h5 id='board-column-header' className='p-3 fw-bold border border-gray text-center mb-0'>
          {column} ({tasks.length})
        </h5>
        <ListGroup id='column-tasks' className='mt-0'>
          {tasks.map(task => (
            <TaskItemProgressColumn key={task._id} task={task} />
          ))}
        </ListGroup>
      </div>
    </Col>
  );
}
