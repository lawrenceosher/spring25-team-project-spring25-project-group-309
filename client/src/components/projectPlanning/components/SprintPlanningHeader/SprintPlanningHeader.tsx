import { FormGroup, FormLabel, FormSelect, Button } from 'react-bootstrap';

export default function SprintPlanningHeader({
  projectName,
  users,
  handleShowCreateSprintModal,
  handleShowCreateTaskModal,
}: {
  projectName: string;
  users: string[];
  handleShowCreateSprintModal: () => void;
  handleShowCreateTaskModal: () => void;
}) {
  return (
    <div id='sprint-planning-header' className='d-flex align-items-center'>
      <h1 id='project-name-header' className='fw-bold d-flex'>
        {projectName} - Sprint Planning
      </h1>
      <div className='d-flex justify-content-end flex-grow-1'>
        <FormGroup className='d-inline-flex me-3 align-middle'>
          <div>
            <FormLabel>Filter by User:</FormLabel>
            <FormSelect>
              {/* onChange call the endpoint to retrieve tasks by username */}
              <option value=''>All</option>
              {users.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </FormSelect>
          </div>
        </FormGroup>
        <Button
          id='sprint-action-button'
          size='lg'
          className='me-2 my-auto'
          onClick={handleShowCreateSprintModal}>
          + Create Sprint
        </Button>
        <Button
          id='sprint-action-button'
          size='lg'
          className='my-auto'
          variant='success'
          onClick={handleShowCreateTaskModal}>
          + Create Task
        </Button>
      </div>
    </div>
  );
}
