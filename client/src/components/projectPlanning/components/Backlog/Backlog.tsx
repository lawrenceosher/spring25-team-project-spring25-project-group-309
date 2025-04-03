import { ListGroup } from 'react-bootstrap';
import { MockBacklog } from '../../../../types/mockTypes/backlog';
import TaskListItem from '../TaskListItem/TaskListItem';

export default function Backlog({ backlog }: { backlog: MockBacklog }) {
  const totalBacklogTaskPoints = backlog.tasks.reduce(
    (points, task) => points + task.taskPoints,
    0,
  );

  return (
    <ListGroup className='rounded-0 '>
      <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
        <div id='sprint-header' className='p-3 ps-2 bg-light'>
          <span>Backlog</span>
          <div className='float-end'>
            <span className='bg-primary-subtle p-2 rounded-pill'>{totalBacklogTaskPoints}</span>
          </div>
        </div>
        <ListGroup className='rounded-0'>
          {backlog.tasks.map(task => (
            <TaskListItem key={task._id} task={task} />
          ))}
        </ListGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
