import { Col, ListGroup } from 'react-bootstrap';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';
import { useDroppable } from '@dnd-kit/core';
import TaskItemProgressColumn from './TaskItemProgressColumn';

export default function ProgressColumn({
  sprint,
  column,
}: {
  sprint: PopulatedDatabaseSprint | null;
  column: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: column,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  if (!sprint) {
    return null;
  }
  const tasks = sprint.tasks.filter(task => task.status === column);
  return (
    <Col ref={setNodeRef} style={style}>
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
