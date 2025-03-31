/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { Card, ListGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { PopulatedDatabaseProject, PopulatedDatabaseTask } from '@fake-stack-overflow/shared';
import { NavLink } from 'react-router-dom';
import useQuestionPage from '../../../../hooks/useQuestionPage';

export default function TaskDetailsCard({
  handleShowDeleteTaskModal,
  handleShowTaskUpdateModal,
  setTaskForModal,
}: {
  handleShowDeleteTaskModal?: () => void;
  handleShowTaskUpdateModal?: () => void;
  setTaskForModal?: (task: PopulatedDatabaseTask) => void;
}) {
  const { selectedTask }: { selectedTask: PopulatedDatabaseTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );
  const { project }: { project: PopulatedDatabaseProject } = useSelector(
    (state: any) => state.projectReducer,
  );
  const { qlist } = useQuestionPage();

  if (!selectedTask) {
    return null;
  }
  return (
    <Card key={selectedTask._id.toString()}>
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
        <Card.Subtitle className='mb-2 text-muted'>
          {project.sprints.find(s => s._id.toString() === selectedTask.sprint?.toString())?.name ||
            'Backlog'}
        </Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>Priority: {selectedTask.priority}</Card.Subtitle>
        <Card.Subtitle className='mb-2 text-muted'>
          Assigned To: {selectedTask.assignedUser}
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
                <NavLink to={`/question/${question}`}>
                  {qlist.find((q: any) => q._id === question)?.title || 'Question not found'}
                </NavLink>
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
              <ListGroup.Item key={dependentTask} className='bg-transparent p-1'>
                {[...project.sprints.flatMap(sprint => sprint.tasks), ...project.backlogTasks].find(
                  (task: any) => task._id.toString() === dependentTask.toString(),
                )?.name || 'Task not found'}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      )}

      {selectedTask.prereqTasks && selectedTask.prereqTasks.length > 0 && (
        <Card.Footer>
          <span>Task Prerequisites:</span>
          <ListGroup variant='flush' className='mt-2'>
            {selectedTask.prereqTasks.map((preReqTask: any) => (
              <ListGroup.Item key={preReqTask} className='bg-transparent p-1'>
                {[...project.sprints.flatMap(sprint => sprint.tasks), ...project.backlogTasks].find(
                  (task: any) => task._id.toString() === preReqTask.toString(),
                )?.name || 'Task not found'}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      )}
    </Card>
  );
}
