import { ListGroupItem } from 'react-bootstrap';
import { getStatusColor } from '../../../../tool';
import './TaskListItem.css';
import useSprintPlanningPage from '../../../../hooks/useSprintPlanningPage';
import { MockTask } from '../../../../types/mockTypes/task';

export default function TaskListItem({ task }: { task: MockTask }) {
  const { setSelectedTaskOnChange } = useSprintPlanningPage();

  return (
    <ListGroupItem
      className='d-flex align-items-center'
      onClick={() => {
        setSelectedTaskOnChange(task);
      }}>
      <div id='task-name-label' className='flex-grow-1'>
        {task.name}
      </div>
      <div className='d-flex justify-content-end flex-grow-1'>
        <span className={`p-2 rounded-pill fs-6 me-1 ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className='bg-primary-subtle p-2 rounded-pill fs-6'>{task.taskPoints}</span>
      </div>
    </ListGroupItem>
  );
}
