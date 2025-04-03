/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, ListGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPencil } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseProject } from '../../../../types/types';
import useQuestionPage from '../../../../hooks/useQuestionPage';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';
import { updateTask } from '../../../../services/taskService';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { setProject, updateTaskInProject } from '../../../../redux/projectReducer/projectReducer';
import { getProjectsByUser } from '../../../../services/projectService';
import { setErrorMessage } from '../../../../redux/errorReducer/errorReducer';
import TaskUpdateForm from '../TaskUpdateForm/TaskUpdateForm';

export default function TaskDetailsModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );

  const { project }: { project: PopulatedDatabaseProject } = useSelector(
    (state: any) => state.projectReducer,
  );
  const { qlist } = useQuestionPage();

  const [isEditing, setIsEditing] = useState(false);

  const [taskToUpdate, setTaskToUpdate] = useState<DatabaseClientTask>({ ...selectedTask });

  useEffect(() => {
    if (selectedTask) {
      setTaskToUpdate({ ...selectedTask });
    }
  }, [selectedTask]);

  const dispatch = useDispatch();

  const handleUpdateTask = async (task: DatabaseClientTask) => {
    try {
      const updatedTask = await updateTask(task._id.toString(), taskToUpdate);
      dispatch(updateTaskInProject({ taskId: task._id.toString(), updatedTask }));
      dispatch(setSelectedTask({ ...taskToUpdate }));
      const updatedProject = await getProjectsByUser(taskToUpdate.assignedUser);
      dispatch(setProject(updatedProject[0]));
    } catch (error) {
      dispatch(setErrorMessage('Error updating task'));
    }
  };

  if (!selectedTask) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      {isEditing ? (
        <div className='p-3'>
          <TaskUpdateForm taskToUpdate={taskToUpdate} setTaskToUpdate={setTaskToUpdate} />
        </div>
      ) : (
        <Card key={selectedTask._id.toString()}>
          <Card.Body>
            <Card.Title className='fs-4'>
              {selectedTask.name}
              <span className='float-end'>
                <FaPencil className='text-primary me-3' onClick={() => setIsEditing(true)} />
              </span>
            </Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {project.sprints.find(s => s._id.toString() === selectedTask.sprint?.toString())
                ?.name || 'Backlog'}
            </Card.Subtitle>
            <Card.Subtitle className='mb-2 text-muted'>
              Priority: {selectedTask.priority}
            </Card.Subtitle>
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
                      {qlist.find((q: any) => q._id === question._id)?.title ||
                        'Question not found'}
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
                    {[
                      ...project.sprints.flatMap(sprint => sprint.tasks),
                      ...project.backlogTasks,
                    ].find(
                      (task: any) =>
                        task._id.toString() ===
                        (dependentTask._id?.toString() || dependentTask.toString()),
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
                    {[
                      ...project.sprints.flatMap(sprint => sprint.tasks),
                      ...project.backlogTasks,
                    ].find(
                      (task: any) =>
                        task._id.toString() ===
                        (preReqTask._id?.toString() || preReqTask.toString()),
                    )?.name || 'Task not found'}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Footer>
          )}
        </Card>
      )}

      <Modal.Footer>
        {isEditing && (
          <>
            <Button
              variant='primary'
              onClick={() => {
                setIsEditing(false);
              }}>
              Stop Editing
            </Button>
            <Button
              variant='success'
              onClick={() => {
                handleUpdateTask(taskToUpdate);
                setIsEditing(false);
              }}>
              Update Task
            </Button>
          </>
        )}
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
