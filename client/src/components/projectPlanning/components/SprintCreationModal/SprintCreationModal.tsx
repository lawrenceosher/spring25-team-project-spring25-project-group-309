import { Button, Form, Modal } from 'react-bootstrap';

export default function SprintCreationModal({
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
          <Modal.Title>Create Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='sprintTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' placeholder='Enter Sprint Title' />
            </Form.Group>
            <Form.Group controlId='sprintStartDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type='date' />
            </Form.Group>
            <Form.Group controlId='sprintEndDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control type='date' />
            </Form.Group>
            <Form.Group controlId='sprintStatus'>
              <Form.Label>Status</Form.Label>
              <Form.Select>
                <option value='To-Do'>To-Do</option>
                <option value='In Progress'>In Progress</option>
                <option value='Done'>Done</option>
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
            variant='primary'
            onClick={() => {
              handleClose();
            }}>
            Create Sprint
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
