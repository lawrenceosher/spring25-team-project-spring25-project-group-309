import { Sprint } from '@fake-stack-overflow/shared';
import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { VscDebugStart } from 'react-icons/vsc';

export default function SprintListGroup({
  sprint,
  handleShowDeleteSprintModal,
}: {
  sprint: Sprint;
  handleShowDeleteSprintModal: () => void;
}) {
  return (
    <ListGroup className='rounded-0'>
      <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
        <div id='sprint-header' className='p-3 ps-2 bg-light'>
          <span>{sprint.name}</span>
          <span className='ms-4 text-muted'>2/27/25 - 3/12/25</span>
          <div className='float-end'>
            <span className='me-3 rounded-pill p-2 bg-danger-subtle'>{sprint.status}</span>
            <span className='me-3 bg-primary-subtle p-2 rounded-pill'>10</span>
            <FaPencil className='text-primary me-3' />
            <FaTrash className='text-danger me-1' onClick={handleShowDeleteSprintModal} />
          </div>
        </div>
        <ListGroup className='rounded-0'>
          <ListGroup.Item>
            <span>Task 1</span>
            <div className='float-end'>
              <span className='bg-danger-subtle p-2 rounded-pill fs-6 me-1'>To-Do</span>
              <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <span>Task 2</span>
            <div className='float-end'>
              <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
              <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <span>Task 3</span>
            <div className='float-end'>
              <span className='bg-success-subtle p-2 rounded-pill fs-6 me-1'>Done</span>
              <span className='bg-primary-subtle p-2 rounded-pill fs-6'>3</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className='bg-body-secondary text-center'>
            <Button variant='success'>
              <VscDebugStart className='mb-1' /> Start Sprint
              {/* Only render for sprints that have not been started yet */}
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
