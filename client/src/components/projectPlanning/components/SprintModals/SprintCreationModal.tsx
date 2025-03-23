import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNewSprint } from '../../../../redux/projectReducer/projectReducer';
import { MockSprint } from '../../../../types/mockTypes/sprint';
import { MockProject } from '../../../../types/mockTypes/project';

export default function SprintCreationModal({
  show,
  handleClose,
  project,
}: {
  show: boolean;
  handleClose: () => void;
  project: MockProject;
}) {
  const [createdSprint, setCreatedSprint] = useState<MockSprint>({
    _id: new Date().getTime().toString(),
    name: '',
    project: project._id,
    start_date: new Date(),
    end_date: new Date(),
    status: 'Not Started',
    tasks: [],
  });

  const dispatch = useDispatch();

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
          <Modal.Title>Create Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='sprintTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Sprint Title'
                defaultValue={createdSprint.name}
                onChange={e => setCreatedSprint({ ...createdSprint, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId='sprintStartDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                defaultValue={formatDateForFormInput(createdSprint.start_date)}
                onChange={e =>
                  setCreatedSprint({
                    ...createdSprint,
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
                defaultValue={formatDateForFormInput(createdSprint.end_date)}
                onChange={e =>
                  setCreatedSprint({
                    ...createdSprint,
                    end_date: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId='sprintTasks'>
              <Form.Label>Tasks</Form.Label>
              <Form.Select
                multiple
                defaultValue={[]}
                onChange={e =>
                  setCreatedSprint({
                    ...createdSprint,
                    tasks: Array.from(e.target.selectedOptions, option =>
                      project.backlog.tasks.find(task => task._id === option.value),
                    ),
                  })
                }>
                {project.backlog.tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.name}
                  </option>
                ))}
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
              // Need to call the service to create a new Sprint
              dispatch(addNewSprint(createdSprint));
              setCreatedSprint({
                _id: new Date().getTime().toString(),
                name: '',
                project: project._id,
                start_date: new Date(),
                end_date: new Date(),
                status: 'To-Do',
                tasks: [],
              }); // Reset the form
              handleClose();
            }}>
            Create Sprint
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
