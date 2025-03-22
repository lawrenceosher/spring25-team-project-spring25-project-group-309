import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { MockSprint } from '../../../../types/mockTypes/sprint';

export default function SprintUpdateModal({
  show,
  handleClose,
  sprintToUpdate,
}: {
  show: boolean;
  handleClose: () => void;
  sprintToUpdate: MockSprint;
}) {
  const [updatedSprint, setUpdatedSprint] = useState<MockSprint>({ ...sprintToUpdate });

  useEffect(() => {
    setUpdatedSprint({ ...sprintToUpdate });
  }, [sprintToUpdate]);

  function formatDateForFormInput(myDate: Date) {
    // Code taken from GeeksForGeeks: https://www.geeksforgeeks.org/how-to-format-javascript-date-as-yyyy-mm-dd/
    const year = myDate.getFullYear();
    const month = String(myDate.getMonth() + 1).padStart(2, '0');
    const day = String(myDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div>
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
                value={formatDateForFormInput(updatedSprint.start_date)}
                onChange={e =>
                  setUpdatedSprint({
                    ...updatedSprint,
                    // Had to add one day to the date to make it accurate - was always one day behind before
                    start_date: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId='sprintEndDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                value={formatDateForFormInput(updatedSprint.end_date)}
                onChange={e =>
                  setUpdatedSprint({
                    ...updatedSprint,
                    end_date: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
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
    </div>
  );
}
