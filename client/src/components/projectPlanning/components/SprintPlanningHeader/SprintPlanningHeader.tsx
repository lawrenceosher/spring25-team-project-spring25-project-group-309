import { FormGroup, FormLabel, FormSelect, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useUserContext from '../../../../hooks/useUserContext';
import { filterTasksByUser, setProject } from '../../../../redux/projectReducer/projectReducer';
import { getProjectsByUser } from '../../../../services/projectService';

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
  const { user: currentUser } = useUserContext();
  const dispatch = useDispatch();

  const handleFilterChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = event.target.value;
    const result = await getProjectsByUser(currentUser.username);
    dispatch(setProject(result[0]));
    if (selectedUser !== '') {
      dispatch(filterTasksByUser({ user: selectedUser }));
    }
  };

  return (
    <div id='sprint-planning-header' className='d-flex align-items-center'>
      <h1 id='project-name-header' className='fw-bold d-flex'>
        {projectName} - Sprint Planning
      </h1>
      <div className='d-flex justify-content-end flex-grow-1'>
        <FormGroup className='d-inline-flex me-3 align-middle'>
          <div>
            <FormLabel>Filter by User:</FormLabel>
            <FormSelect onChange={handleFilterChange}>
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
