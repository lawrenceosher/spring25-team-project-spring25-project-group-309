/* eslint-disable import/no-extraneous-dependencies */
import { Button, Card, ListGroup } from 'react-bootstrap';
import './index.css';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

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

      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          <ListGroup className='rounded-0'>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Sprint Title 1</span>
                <div className='float-end'>
                  <span className='me-3 bg-primary-subtle p-2 rounded-pill'>10</span>
                  <FaPencil className='text-primary me-3' />
                  <FaTrash className='text-danger me-1' />
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
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Sprint Title 2</span>
                <div className='float-end'>
                  <span className='me-3 bg-primary-subtle p-2 rounded-pill'>5</span>
                  <FaPencil className='text-primary me-3' />
                  <FaTrash className='text-danger me-1' />
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
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>1</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Task 3</span>
                  <div className='float-end'>
                    <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Backlog</span>
                <div className='float-end'>
                  <span className='bg-primary-subtle p-2 rounded-pill'>20</span>
                </div>
              </div>
              <ListGroup className='rounded-0'>
                <ListGroup.Item>
                  <span>Backlog Task 1</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>10</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 2</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 3</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div id='task-details' className='ms-3'>
          <Card>
            <Card.Body>
              <Card.Title className='fs-4'>Task Title</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>Sprint 1</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Assigned To: Username</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Status: In Progress</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Task Points: 5</Card.Subtitle>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the
                card&apos;s content. The description of the Task will go here Some quick example
                text to build on the card title and make up the bulk of the card&apos;s content. The
                description of the Task will go here Some quick example text to build on the card
                title and make up the bulk of the card&apos;s content. The description of the Task
                will go here.
              </Card.Text>
              <Card.Footer>
                <span>Relevant Fake Stack Overflow Questions:</span>
                <ListGroup variant='flush' className='mt-2'>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 1</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 2</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 3</Card.Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
              <Card.Footer>
                <span>Task Dependencies:</span>
                <ListGroup variant='flush' className='mt-2'>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 1</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 2</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 3</Card.Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
