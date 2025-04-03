import { Col, ListGroup } from 'react-bootstrap';
import { PopulatedDatabaseTask } from '@fake-stack-overflow/shared';

import TaskItemProgressColumn from './TaskItemProgressColumn';

export default function BacklogColumn({
  projectBacklog,
}: {
  projectBacklog: PopulatedDatabaseTask[];
}) {
  return (
    <Col>
      <div className='rounded bg-secondary-subtle p-2'>
        <h5 id='board-column-header' className='p-3 fw-bold border border-gray text-center mb-0'>
          Backlog ({projectBacklog.length})
        </h5>
        <ListGroup id='column-tasks' className='mt-0'>
          {projectBacklog.map(task => (
            <TaskItemProgressColumn key={task._id.toString()} task={task} />
          ))}
        </ListGroup>
      </div>
    </Col>
  );
}
