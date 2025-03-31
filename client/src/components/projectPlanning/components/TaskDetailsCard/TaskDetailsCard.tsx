/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { Card, ListGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import { NavLink } from 'react-router-dom';

export default function TaskDetailsCard({
  handleShowDeleteTaskModal,
  handleShowTaskUpdateModal,
  setTaskForModal,
}: {
  handleShowDeleteTaskModal?: () => void;
  handleShowTaskUpdateModal?: () => void;
  setTaskForModal?: (task: PopulatedDatabaseTask) => void;
}) {
  const { selectedTask } = useSelector((state: any) => state.selectTaskReducer);

  if (!selectedTask) {
    return null;
  }
  return (
    <Card key={selectedTask._id}>
      <Card.Body>
        <Card.Title className='fs-4'>
          {selectedTask.name}
          {handleShowTaskUpdateModal && handleShowDeleteTaskModal && setTaskForModal && (
            <span className='float-end'>
              <FaPencil className='text-primary me-3' onClick={handleShowTaskUpdateModal} />
              <FaTrash
                className='text-danger me-1'
                onClick={() => {
                  setTaskForModal({ ...selectedTask });
                  handleShowDeleteTaskModal();
                }}
              />
            </span>
          )}
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>{selectedTask.sprint}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Priority: {selectedTask.priority}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>
          Assigned To: {selectedTask.assigned_user}
        </Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Status: {selectedTask.status}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>
          Task Points: {selectedTask.taskPoints}
        </Card.Subtitle>
        <Card.Text>{selectedTask.description}</Card.Text>
      </Card.Body>

      {selectedTask.relevantQuestions && selectedTask.relevantQuestions.length > 0 && (
        <Card.Footer>
          <span>Relevant Fake Stack Overflow Questions:</span>
          <ListGroup variant='flush' className='mt-2'>
            {selectedTask.relevantQuestions.map((question: any) => (
              <ListGroup.Item key={question} className='bg-transparent p-1'>
                <NavLink to={`/question/${question}`}>{question}</NavLink>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      )}

      {selectedTask.dependentTasks && selectedTask.dependentTasks.length > 0 && (
        <Card.Footer>
          <span>Task Dependencies:</span>
          <ListGroup variant='flush' className='mt-2'>
            {selectedTask.dependentTasks.map((dependentTask: any) => (
              <ListGroup.Item key={dependentTask._id} className='bg-transparent p-1'>
                {dependentTask}
                {/* Need to figure out a way to get the dependent tasks fully there. Same for pre-reqs */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      )}

      {selectedTask.prereqForTasks && selectedTask.prereqForTasks.length > 0 && (
        <Card.Footer>
          <span>Task Prerequisites:</span>
          <ListGroup variant='flush' className='mt-2'>
            {selectedTask.prereqForTasks.map((preReqTask: any) => (
              <ListGroup.Item key={preReqTask._id} className='bg-transparent p-1'>
                {preReqTask}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      )}
    </Card>
  );
}
