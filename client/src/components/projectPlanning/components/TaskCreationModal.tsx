import { Button, Form, Modal } from 'react-bootstrap';

export default function TaskCreationModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='taskTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' placeholder='Enter Task Title' />
            </Form.Group>
            <Form.Group controlId='taskSprint'>
              <Form.Label>Sprint</Form.Label>
              <Form.Select>
                <option value='Backlog'>Backlog</option>
                <option value='1'>Sprint 1</option>
                <option value='2'>Sprint 2</option>
                <option value='3'>Sprint 3</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId='taskUser'>
              <Form.Label>User</Form.Label>
              <Form.Select>
                <option value='1'>User1</option>
                <option value='2'>User2</option>
                <option value='3'>User3</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId='taskStatus'>
              <Form.Label>Status</Form.Label>
              <Form.Select>
                <option value='To-Do'>To-Do</option>
                <option value='In Progress'>In Progress</option>
                <option value='Done'>Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId='taskPoints'>
              <Form.Label>Task Points</Form.Label>
              <Form.Control type='number' placeholder='Enter Task Points' />
            </Form.Group>
            <Form.Group controlId='taskDescription'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' rows={5} cols={50} placeholder='Enter Task Description' />
            </Form.Group>

            <Form.Group controlId='taskQuestions'>
              <Form.Label>Relevant FaleStackOverflow Questions</Form.Label>
              <Form.Select multiple>
                <option value='1'>Question 1</option>
                <option value='2'>Question 2</option>
                <option value='3'>Question 3</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3' controlId='taskDependencies'>
              <Form.Label>Task Dependencies</Form.Label>
              <Form.Select multiple>
                <option value='1'>Task 1</option>
                <option value='2'>Task 2</option>
                <option value='3'>Task 3</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            {' '}
            Close{' '}
          </Button>
          <Button
            variant='success'
            onClick={() => {
              handleClose();
            }}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
