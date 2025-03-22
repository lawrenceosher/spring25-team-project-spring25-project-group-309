import { Modal, Button } from 'react-bootstrap';

export default function SprintCompletionModal({
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
          <Modal.Title>Complete Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to complete this sprint?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              // Call the service that will complete Sprint
              handleClose();
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
