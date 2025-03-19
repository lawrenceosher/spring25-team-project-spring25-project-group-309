import { Card, ListGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { MockTask } from '../../../../types/mockTypes/task';

export default function TaskDetailsCard({
  task,
  handleShowDeleteTaskModal,
}: {
  task: MockTask;
  handleShowDeleteTaskModal: () => void;
}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title className='fs-4'>
          {task.name}
          <span className='float-end'>
            <FaPencil className='text-primary me-3' />
            <FaTrash className='text-danger me-1' onClick={handleShowDeleteTaskModal} />
          </span>
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>{task.sprint.name}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Priority: {task.priority}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Assigned To: {task.assigned_user}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Status: {task.status}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Task Points: {task.taskPoints}</Card.Subtitle>
        <Card.Text>{task.description}</Card.Text>
        {task.relevantQuestions && task.relevantQuestions.length > 0 && (
          <Card.Footer>
            <span>Relevant Fake Stack Overflow Questions:</span>
            <ListGroup variant='flush' className='mt-2'>
              {task.relevantQuestions.map(question => (
                <ListGroup.Item key={question} className='bg-transparent p-1'>
                  <Card.Link href='#'>{question}</Card.Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Footer>
        )}

        {task.dependentTasks && task.dependentTasks.length > 0 && (
          <Card.Footer>
            <span>Task Dependencies:</span>
            <ListGroup variant='flush' className='mt-2'>
              {task.dependentTasks.map(dependentTask => (
                <ListGroup.Item key={dependentTask._id} className='bg-transparent p-1'>
                  <Card.Link href='#'>{dependentTask.name}</Card.Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Footer>
        )}

        {task.prereqForTasks && task.prereqForTasks.length > 0 && (
          <Card.Footer>
            <span>Task Prerequisites:</span>
            <ListGroup variant='flush' className='mt-2'>
              {task.prereqForTasks.map(preReqTask => (
                <ListGroup.Item key={preReqTask._id} className='bg-transparent p-1'>
                  <Card.Link href='#'>{preReqTask.name}</Card.Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Footer>
        )}
      </Card.Body>
    </Card>
  );
}
