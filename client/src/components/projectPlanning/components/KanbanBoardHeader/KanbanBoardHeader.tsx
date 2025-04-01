/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormGroup, FormLabel, FormSelect, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getFullDate } from '../../../../tool';

export default function KanbanBoardHeader({
  handleShowCreateTaskModal,
  handleShowCompleteSprintModal,
}: {
  handleShowCreateTaskModal: () => void;
  handleShowCompleteSprintModal: () => void;
}) {
  const { project } = useSelector((state: any) => state.projectReducer);

  return (
    <>
      <div id='kanban-board-header' className='d-flex align-items-center'>
        <h1 className='fw-bold d-flex flex-fill'>{project.name} - Board</h1>
        <span>
          <FormGroup className='d-inline-flex me-3 align-middle'>
            <div>
              <FormLabel>Filter by User:</FormLabel>
              <FormSelect>
                {/* onChange call the endpoint to retrieve tasks by username */}
                <option value=''>All</option>
                {project.assignedUsers.map((user: string) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </FormSelect>
            </div>
          </FormGroup>
          <Button
            variant='danger'
            size='lg'
            className='me-2'
            onClick={handleShowCompleteSprintModal}>
            Complete Sprint
          </Button>
          <Button size='lg' variant='success' onClick={handleShowCreateTaskModal}>
            + Create Task
          </Button>
        </span>
      </div>
      {/* Need to have an active sprint field and show that on the board */}
      <h3 className='text-muted'>
        {project.sprints[0].name}: {getFullDate(project.sprints[0].startDate)} -{' '}
        {getFullDate(project.sprints[0].endDate)}
      </h3>
    </>
  );
}
