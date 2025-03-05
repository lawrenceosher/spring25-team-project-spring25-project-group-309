import { Button, ListGroup } from 'react-bootstrap';
import './index.css';

export default function SprintPlanningPage() {
  return (
    <div className='p-3'>
      <div id='sprint-planning-header' className='d-flex'>
        <h1 className='fw-bold d-flex flex-fill'>Sprint Planning & Backlog</h1>
        <span className=''>
          <Button size='lg' className='me-2'>
            + Create Sprint
          </Button>
          <Button size='lg' variant='success'>
            + Create Task
          </Button>
        </span>
      </div>

      <main className='mt-5' id='sprints'>
        <ListGroup className='rounded-0'>
          <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
            <div id='sprint-header' className='p-3 ps-2 bg-light'>
              Sprint Title 1
            </div>
            <ListGroup className='rounded-0'>
              <ListGroup.Item>Task 1</ListGroup.Item>
              <ListGroup.Item>Task 2</ListGroup.Item>
              <ListGroup.Item>Task 3</ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>

        <ListGroup className='rounded-0 '>
          <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
            <div id='sprint-header' className='p-3 ps-2 bg-light'>
              Sprint Title 2
            </div>
            <ListGroup className='rounded-0'>
              <ListGroup.Item>Task 1</ListGroup.Item>
              <ListGroup.Item>Task 2</ListGroup.Item>
              <ListGroup.Item>Task 3</ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>

        <ListGroup className='rounded-0 '>
          <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
            <div id='sprint-header' className='p-3 ps-2 bg-light'>
              Backlog
            </div>
            <ListGroup className='rounded-0'>
              <ListGroup.Item>Task 1</ListGroup.Item>
              <ListGroup.Item>Task 2</ListGroup.Item>
              <ListGroup.Item>Task 3</ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>

        <div>Card</div>
      </main>
    </div>
  );
}
