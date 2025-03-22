import { Col, ListGroup } from 'react-bootstrap';
import { MockTask } from '../../../../types/mockTypes/task';
import TaskItemProgressColumn from './TaskItemProgressColumn';

export default function BacklogColumn({ projectBacklog }: { projectBacklog: MockTask[] }) {
  return (
    <Col>
      <div className='rounded bg-secondary-subtle p-2'>
        <h5 id='board-column-header' className='p-3 fw-bold border border-gray text-center mb-0'>
          Backlog ({projectBacklog.length})
        </h5>
        <ListGroup id='column-tasks' className='mt-0'>
          {projectBacklog.map(task => (
            <TaskItemProgressColumn
              key={task._id}
              taskName={task.name}
              taskPoints={task.taskPoints}
            />
          ))}
        </ListGroup>
      </div>
    </Col>
  );
}
