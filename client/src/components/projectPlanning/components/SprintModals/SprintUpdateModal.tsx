import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';

export default function SprintUpdateModal({
  show,
  handleClose,
  sprintToUpdate,
}: {
  show: boolean;
  handleClose: () => void;
  sprintToUpdate: PopulatedDatabaseSprint | null;
}) {
  const [updatedSprint, setUpdatedSprint] = useState<PopulatedDatabaseSprint | null>(
    sprintToUpdate
      ? {
          ...sprintToUpdate,
        }
      : null,
  );

  useEffect(() => {
    setUpdatedSprint(sprintToUpdate ? { ...sprintToUpdate } : null);
  }, [sprintToUpdate]);

  function formatDateForFormInput(myDate: Date) {
    const date = new Date(myDate);
    // Code taken from GeeksForGeeks: https://www.geeksforgeeks.org/how-to-format-javascript-date-as-yyyy-mm-dd/
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div>
      {!updatedSprint ? (
        <h1></h1>
      ) : (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Sprint</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='sprintTitle'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Sprint Title'
                  value={updatedSprint.name}
                  onChange={e => setUpdatedSprint({ ...updatedSprint, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId='sprintStartDate'>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type='date'
                  value={formatDateForFormInput(updatedSprint.startDate)}
                  onChange={e =>
                    setUpdatedSprint({
                      ...updatedSprint,
                      // Had to add one day to the date to make it accurate - was always one day behind before
                      startDate: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId='sprintEndDate'>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type='date'
                  value={formatDateForFormInput(updatedSprint.endDate)}
                  onChange={e =>
                    setUpdatedSprint({
                      ...updatedSprint,
                      endDate: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
                    })
                  }
                />
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
                // Call the service to update sprint
                handleClose();
              }}>
              Update Sprint
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
