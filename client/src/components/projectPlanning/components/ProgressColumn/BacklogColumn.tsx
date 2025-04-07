import { Col, ListGroup } from 'react-bootstrap';
import { PopulatedDatabaseTask } from '@fake-stack-overflow/shared';

import { useDroppable } from '@dnd-kit/core';
import TaskItemProgressColumn from './TaskItemProgressColumn';

export default function BacklogColumn({
  projectBacklog,
}: {
  projectBacklog: PopulatedDatabaseTask[];
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'Backlog',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  return (
    <Col ref={setNodeRef} style={style}>
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
