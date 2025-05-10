/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormGroup, FormLabel, FormSelect, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PopulatedDatabaseSprint } from '@fake-stack-overflow/shared';
import { getFullDate } from '../../../../tool';
import useUserContext from '../../../../hooks/useUserContext';
import { getProjectsByUser } from '../../../../services/projectService';
import { filterTasksByUser, setProject } from '../../../../redux/projectReducer/projectReducer';

export default function KanbanBoardHeader({
  sprint,
  handleShowCreateTaskModal,
  handleShowCompleteSprintModal,
}: {
  sprint: PopulatedDatabaseSprint | null;
  handleShowCreateTaskModal: () => void;
  handleShowCompleteSprintModal: () => void;
}) {
  const { project } = useSelector((state: any) => state.projectReducer);
  const { user: currentUser } = useUserContext();
  const dispatch = useDispatch();

  if (!sprint) {
    return null;
  }

  const handleFilterChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = event.target.value;
    const result = await getProjectsByUser(currentUser.username);
    dispatch(setProject(result[0]));
    if (selectedUser !== '') {
      dispatch(filterTasksByUser({ user: selectedUser }));
    }
  };

  return (
    <>
      <div id='kanban-board-header' className='d-flex align-items-center'>
        <h1 className='fw-bold d-flex flex-fill'>{project.name} - Board</h1>
        <span>
          <FormGroup className='d-inline-flex me-3 align-middle'>
            <div>
              <FormLabel>Filter by User:</FormLabel>
              <FormSelect onChange={handleFilterChange}>
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
      <h3 className='text-muted'>
        {sprint.name}: {getFullDate(new Date(sprint.startDate))} - {''}
        {getFullDate(new Date(sprint.endDate))}
      </h3>
    </>
  );
}
