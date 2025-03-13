import {
  Button,
  Col,
  Container,
  FormGroup,
  FormLabel,
  FormSelect,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';

export default function KanbanBoardPage() {
  return (
    <div className='p-3'>
      <div id='kanban-board-header' className='d-flex align-items-center'>
        <h1 className='fw-bold d-flex flex-fill'>Project Name - Board</h1>
        <span>
          <FormGroup className='d-inline-flex me-3 align-middle'>
            <div>
              <FormLabel>Filter by User:</FormLabel>
              {/* Insert list of users in the project here */}
              <FormSelect>
                <option value='None'>None</option>
                <option value='User 1'>User 1</option>
                <option value='User 2'>User 2</option>
                <option value='User 3'>User 3</option>
              </FormSelect>
            </div>
          </FormGroup>
          <Button variant='danger' size='lg' className='me-2'>
            Complete Sprint
          </Button>
          <Button size='lg' variant='success'>
            + Create Task
          </Button>
        </span>
      </div>

      <h3 className='text-muted'>Sprint Name: 2/27/25 - 3/11/25</h3>

      <Container className='bg-transparent mt-3' fluid>
        <Row>
          <Col>
            <div className='rounded bg-secondary-subtle p-2'>
              <h5
                id='board-column-header'
                className='p-3 fw-bold border border-gray text-center mb-0'>
                Backlog (4)
              </h5>
              <ListGroup id='column-tasks' className='mt-0'>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 1</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 2</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 3</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 4</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col>
            <div className='rounded bg-secondary-subtle p-2'>
              <h5
                id='board-column-header'
                className='p-3 fw-bold border border-gray text-center mb-0'>
                To-Do (1)
              </h5>
              <ListGroup id='column-tasks' className='mt-0'>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 1</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col>
            <div className='rounded bg-secondary-subtle p-2'>
              <h5
                id='board-column-header'
                className='p-3 fw-bold border border-gray text-center mb-0'>
                In Progress (2)
              </h5>
              <ListGroup id='column-tasks' className='mt-0'>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 1</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 2</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col>
            <div className='rounded bg-secondary-subtle p-2'>
              <h5
                id='board-column-header'
                className='p-3 fw-bold border border-gray text-center mb-0'>
                Done (3)
              </h5>
              <ListGroup id='column-tasks' className='mt-0'>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 1</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 2</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex align-items-center mb-2'>
                  <span className='flex-fill'>Task 3</span>
                  <span className='float-end bg-primary-subtle rounded-pill py-1 px-2'>5</span>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
