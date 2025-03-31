import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { PopulatedDatabaseProject, Sprint } from '../../../../types/types';
import { createSprint } from '../../../../services/sprintService';
import { addNewSprintToProject } from '../../../../redux/projectReducer/projectReducer';

export default function SprintCreationModal({
  show,
  handleClose,
  project,
}: {
  show: boolean;
  handleClose: () => void;
  project: PopulatedDatabaseProject;
}) {
  const [createdSprint, setCreatedSprint] = useState<Sprint>({
    name: '',
    project: project._id,
    startDate: new Date(),
    endDate: new Date(),
    status: 'Not Started',
    tasks: [],
  });

  const dispatch = useDispatch();

  const handleCreateSprint = async (sprint: Sprint) => {
    try {
      const newSprint = await createSprint(sprint);
      dispatch(addNewSprintToProject(newSprint));
    } catch (error) {
      console.error('Error creating sprint:', error);
    }
  };

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
                defaultValue={formatDateForFormInput(createdSprint.startDate)}
                onChange={e =>
                  setCreatedSprint({
                    ...createdSprint,
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
                defaultValue={formatDateForFormInput(createdSprint.endDate)}
                onChange={e =>
                  setCreatedSprint({
                    ...createdSprint,
                    endDate: new Date(new Date(e.target.value).getTime() + 60 * 60 * 24 * 1000),
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
                    tasks: Array.from(
                      e.target.selectedOptions,
                      option =>
                        project.backlogTasks.find(task => task._id.toString() === option.value)
                          ?._id,
                    ).filter(_id => _id !== undefined),
                  })
                }>
                {project.backlogTasks.map(task => (
                  <option key={task._id.toString()} value={task._id.toString()}>
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
              handleCreateSprint(createdSprint);
              setCreatedSprint({
                name: '',
                project: project._id,
                startDate: new Date(),
                endDate: new Date(),
                status: 'Not Started',
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
