/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ObjectId } from 'mongodb';
import {
  PopulatedDatabaseProject,
  PopulatedDatabaseQuestion,
  PopulatedDatabaseTask,
  DatabaseTag,
  DatabaseQuestion,
  DatabaseTask,
} from '../../../../types/types';
import useQuestionPage from '../../../../hooks/useQuestionPage';

export default function TaskUpdateModal({
  show,
  handleClose,
  project,
}: {
  show: boolean;
  handleClose: () => void;
  project: PopulatedDatabaseProject;
}) {
  const { selectedTask } = useSelector((state: any) => state.selectTaskReducer);

  const [taskToUpdate, setTaskToUpdate] = useState<PopulatedDatabaseTask>({ ...selectedTask });

  const { qlist } = useQuestionPage();

  useEffect(() => {
    setTaskToUpdate({ ...selectedTask });
  }, [selectedTask]);

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                value={
                  taskToUpdate.sprint?.id.toString() ? taskToUpdate.sprint.id.toString() : 'Backlog'
                }
                onChange={e =>
                  setTaskToUpdate({ ...taskToUpdate, sprint: new ObjectId(e.target.value) })
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
                        qlist.find(
                          (question: PopulatedDatabaseQuestion) =>
                            question._id.toString() === option.value,
                        ) || null,
                    )
                      .filter(question => question !== null)
                      .map(question => ({
                        ...question,
                        tags: question.tags.map((tag: DatabaseTag) => tag._id),
                      })) as unknown as DatabaseQuestion[],
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
                defaultValue={[]}
                onChange={e =>
                  setTaskToUpdate({
                    ...taskToUpdate,
                    prereqTasks: Array.from(
                      e.target.selectedOptions,
                      option =>
                        project.sprints
                          .flatMap(sprint => sprint.tasks)
                          .find(task => task._id.toString() === option.value) || null,
                    ).filter(task => task !== null) as DatabaseTask[],
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
                        project.sprints
                          .flatMap(sprint => sprint.tasks)
                          .find(task => task._id.toString() === option.value) || null,
                    ).filter(task => task !== null) as DatabaseTask[],
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            {' '}
            Close{' '}
          </Button>
          <Button
            variant='success'
            onClick={() => {
              // Call the service to update a task
              handleClose();
            }}>
            Update Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
