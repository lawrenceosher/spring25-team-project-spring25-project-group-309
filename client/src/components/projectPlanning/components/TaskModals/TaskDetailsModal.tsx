/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Form, ListGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPencil } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PopulatedDatabaseProject, PopulatedDatabaseQuestion } from '../../../../types/types';
import useQuestionPage from '../../../../hooks/useQuestionPage';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';
import { updateTask } from '../../../../services/taskService';
import { setSelectedTask } from '../../../../redux/selectTask/selectTaskReducer';
import { updateTaskInProject } from '../../../../redux/projectReducer/projectReducer';

export default function TaskDetailsModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { selectedTask } = useSelector((state: any) => state.selectTaskReducer);

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
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!selectedTask) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      {isEditing ? (
        <Form className='p-3'>
          <Form.Group controlId='taskTitle'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter New Task Title'
              value={taskToUpdate.name}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId='taskSprint'>
            <Form.Label>Sprint</Form.Label>
            <Form.Select
              value={taskToUpdate.sprint ? taskToUpdate.sprint : undefined}
              onChange={e =>
                setTaskToUpdate({
                  ...taskToUpdate,
                  sprint: e.target.value !== undefined ? e.target.value : null,
                })
              }>
              <option value={undefined}>Backlog</option>
              {project.sprints.map(sprint => (
                <option key={sprint._id.toString()} value={sprint._id.toString()}>
                  {sprint.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId='taskPriority'>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={taskToUpdate.priority}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, priority: e.target.value })}>
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId='taskUser'>
            <Form.Label>User</Form.Label>
            <Form.Select
              value={taskToUpdate.assignedUser}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, assignedUser: e.target.value })}>
              {project.assignedUsers.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId='taskStatus'>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={taskToUpdate.status}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, status: e.target.value })}>
              <option value='To-Do'>To-Do</option>
              <option value='In Progress'>In Progress</option>
              <option value='Done'>Done</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId='taskPoints'>
            <Form.Label>Task Points</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter Task Points'
              value={taskToUpdate.taskPoints}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, taskPoints: +e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId='taskDescription'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              cols={50}
              placeholder='Enter Task Description'
              value={taskToUpdate.description}
              onChange={e => setTaskToUpdate({ ...taskToUpdate, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId='taskQuestions'>
            <Form.Label>Relevant FakeStackOverflow Questions</Form.Label>
            <Form.Select
              multiple
              defaultValue={[]}
              onChange={e =>
                setTaskToUpdate({
                  ...taskToUpdate,
                  relevantQuestions: Array.from(
                    e.target.selectedOptions,
                    option =>
                      qlist
                        .find(
                          (question: PopulatedDatabaseQuestion) =>
                            question._id.toString() === option.value,
                        )
                        ?._id.toString() || null,
                  ).filter(_id => _id !== null),
                })
              }>
              {qlist.map((question: PopulatedDatabaseQuestion) => (
                <option key={question._id.toString()} value={question._id.toString()}>
                  {question.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3' controlId='taskPrerequisites'>
            <Form.Label>Task Prerequisites</Form.Label>
            <Form.Select
              multiple
              defaultValue={taskToUpdate.prereqTasks}
              onChange={e =>
                setTaskToUpdate({
                  ...taskToUpdate,
                  prereqTasks: Array.from(
                    e.target.selectedOptions,
                    option =>
                      [
                        ...project.sprints.flatMap(sprint => sprint.tasks),
                        ...project.backlogTasks,
                      ].find(task => task._id.toString() === option.value)?._id || null,
                  ).filter(_id => _id !== null),
                })
              }>
              {project.sprints.map(sprint =>
                sprint.tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.name}
                  </option>
                )),
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3' controlId='taskDependencies'>
            <Form.Label>Task Dependencies</Form.Label>
            <Form.Select
              multiple
              defaultValue={[]}
              onChange={e =>
                setTaskToUpdate({
                  ...taskToUpdate,
                  dependentTasks: Array.from(
                    e.target.selectedOptions,
                    option =>
                      [
                        ...project.sprints.flatMap(sprint => sprint.tasks),
                        ...project.backlogTasks,
                      ].find(task => task._id.toString() === option.value)?._id || null,
                  ).filter(_id => _id !== null),
                })
              }>
              {project.sprints.map(sprint =>
                sprint.tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.name}
                  </option>
                )),
              )}
            </Form.Select>
          </Form.Group>
        </Form>
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
