import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { VscDebugStart } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { PopulatedDatabaseSprint } from '../../../../types/types';
import TaskListItem from '../TaskListItem/TaskListItem';
import { getFullDate, getStatusColor } from '../../../../tool';
import { startSprint } from '../../../../services/sprintService';
import { updateSprintInProject } from '../../../../redux/projectReducer/projectReducer';

export default function SprintListGroup({
  sprint,
  handleShowSprintUpdateModal,
  handleShowDeleteSprintModal,
  setSprintForModal,
}: {
  sprint: PopulatedDatabaseSprint;
  handleShowSprintUpdateModal: () => void;
  handleShowDeleteSprintModal: () => void;
  setSprintForModal: (sprint: PopulatedDatabaseSprint) => void;
}) {
  const totalSprintTaskPoints = sprint.tasks.reduce((points, task) => points + task.taskPoints, 0);

  const dispatch = useDispatch();

  const handleStartSprint = async () => {
    try {
      const startedSprint = await startSprint(sprint._id.toString());
      dispatch(
        updateSprintInProject({ sprintId: sprint._id.toString(), updatedSprint: startedSprint }),
      );
    } catch (error) {
      console.error('Error starting sprint:', error);
    }
  };

  return (
    <ListGroup className='rounded-0'>
      <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
        <div id='sprint-header' className='p-3 ps-2 bg-light'>
          <span>{sprint.name}</span>
          <span className='ms-4 text-muted'>
            {`${getFullDate(new Date(sprint.startDate))} - ${getFullDate(new Date(sprint.endDate))}`}
          </span>
          <div className='float-end'>
            <span className={`me-3 rounded-pill p-2 ${getStatusColor(sprint.status)}`}>
              {sprint.status}
            </span>
            <span className='me-3 bg-primary-subtle p-2 rounded-pill'>{totalSprintTaskPoints}</span>
            <FaPencil
              className='text-primary me-3'
              onClick={() => {
                setSprintForModal({ ...sprint });
                handleShowSprintUpdateModal();
              }}
            />
            <FaTrash
              className='text-danger me-1'
              onClick={() => {
                setSprintForModal({ ...sprint });
                handleShowDeleteSprintModal();
              }}
            />
          </div>
        </div>
        <ListGroup className='rounded-0'>
          {sprint.tasks.map(task => (
            <TaskListItem key={task._id} task={task} />
          ))}
          {sprint.status === 'Not Started' && (
            <ListGroup.Item className='bg-body-secondary text-center'>
              <Button
                variant='success'
                onClick={() => {
                  handleStartSprint();
                }}>
                <VscDebugStart className='mb-1' /> Start Sprint
              </Button>
            </ListGroup.Item>
          )}
        </ListGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
