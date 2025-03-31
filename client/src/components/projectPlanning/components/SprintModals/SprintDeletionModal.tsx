import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteSprint } from '../../../../services/sprintService';
import { removeSprintFromProject } from '../../../../redux/projectReducer/projectReducer';

export default function SprintDeletionModal({
  show,
  handleClose,
  sprintTitle,
  sprintId,
}: {
  show: boolean;
  handleClose: () => void;
  sprintTitle: string;
  sprintId: string;
}) {
  const dispatch = useDispatch();

  const handleDeleteSprint = async () => {
    try {
      const deletedSprint = await deleteSprint(sprintId);

      if (deletedSprint) {
        dispatch(removeSprintFromProject({ sprintId }));
      }
    } catch (error) {
      console.error('Error deleting sprint:', error);
    }
  };

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
              handleDeleteSprint();
              handleClose();
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
