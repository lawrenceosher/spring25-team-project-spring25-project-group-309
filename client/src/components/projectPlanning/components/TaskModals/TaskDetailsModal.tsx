import { Button, Modal } from 'react-bootstrap';
import TaskDetailsCard from '../TaskDetailsCard/TaskDetailsCard';

export default function TaskDetailsModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <TaskDetailsCard />
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
