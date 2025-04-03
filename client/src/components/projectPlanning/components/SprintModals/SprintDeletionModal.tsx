import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteSprint } from '../../../../services/sprintService';
import {
  removeSprintFromProject,
  setProject,
} from '../../../../redux/projectReducer/projectReducer';
import useUserContext from '../../../../hooks/useUserContext';
import { getProjectsByUser } from '../../../../services/projectService';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';

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
  const { user: currentUser } = useUserContext();

  const handleDeleteSprint = async () => {
    try {
      const deletedSprint = await deleteSprint(sprintId);

      if (deletedSprint) {
        dispatch(removeSprintFromProject({ sprintId }));
      }
      const updatedProject = await getProjectsByUser(currentUser.username);
      dispatch(setProject(updatedProject[0]));
    } catch (error) {
      dispatch(setErrorMessage('Error deleting sprint'));
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
