import { Button, Modal } from 'react-bootstrap';

export default function SprintDeletionModal({
  show,
  handleClose,
  sprintTitle,
}: {
  show: boolean;
  handleClose: () => void;
  sprintTitle: string;
}) {
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this sprint: {sprintTitle}?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              // Call the service that will delete Sprint
              handleClose();
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
