import { Modal, Button } from 'react-bootstrap';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';
import { useDispatch } from 'react-redux';
import { endSprint } from '../../../../services/sprintService';
import { updateSprintInProject } from '../../../../redux/projectReducer/projectReducer';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';

export default function SprintCompletionModal({
  activeSprint,
  show,
  handleClose,
}: {
  activeSprint: PopulatedDatabaseSprint | null;
  show: boolean;
  handleClose: () => void;
}) {
  const dispatch = useDispatch();

  const handleCompleteSprint = async () => {
    if (!activeSprint) {
      dispatch(setErrorMessage('No active sprint to complete'));
      return;
    }
    const finishedSprint = await endSprint(activeSprint._id.toString());
    dispatch(
      updateSprintInProject({
        sprintId: activeSprint._id.toString(),
        updatedSprint: finishedSprint,
      }),
    );
  };

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
              handleCompleteSprint();
              handleClose();
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
