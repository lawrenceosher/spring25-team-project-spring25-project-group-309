import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { VscDebugStart } from 'react-icons/vsc';
import TaskListItem from '../TaskListItem/TaskListItem';
import { MockSprint } from '../../../../types/mockTypes/sprint';
import { MockTask } from '../../../../types/mockTypes/task';

export default function SprintListGroup({
  sprint,
  tasks,
  handleShowDeleteSprintModal,
}: {
  sprint: MockSprint;
  tasks: MockTask[];
  handleShowDeleteSprintModal: () => void;
}) {
  const totalSprintTaskPoints = tasks.reduce((points, task) => points + task.taskPoints, 0);

  return (
    <ListGroup className='rounded-0'>
      <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
        <div id='sprint-header' className='p-3 ps-2 bg-light'>
          <span>{sprint.name}</span>
          <span className='ms-4 text-muted'>
            {sprint.start_date.toString()} - {sprint.end_date.toString()}
          </span>
          <div className='float-end'>
            <span className='me-3 rounded-pill p-2 bg-danger-subtle'>{sprint.status}</span>
            <span className='me-3 bg-primary-subtle p-2 rounded-pill'>{totalSprintTaskPoints}</span>
            <FaPencil className='text-primary me-3' />
            <FaTrash className='text-danger me-1' onClick={handleShowDeleteSprintModal} />
          </div>
        </div>
        <ListGroup className='rounded-0'>
          {tasks.map(task => (
            <TaskListItem
              key={task._id}
              taskName={task.name}
              taskStatus={task.status}
              taskPoints={task.taskPoints}
            />
          ))}
          {sprint.status === 'Not Started' && (
            <ListGroup.Item className='bg-body-secondary text-center'>
              <Button variant='success'>
                <VscDebugStart className='mb-1' /> Start Sprint
              </Button>
            </ListGroup.Item>
          )}
        </ListGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
