import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { MockTask } from '../../../../types/mockTypes/task';
import { MockProject } from '../../../../types/mockTypes/project';
import { addNewTask } from '../../../../redux/projectReducer/projectReducer';

export default function TaskCreationModal({
  show,
  handleClose,
  project,
}: {
  show: boolean;
  handleClose: () => void;
  project: MockProject;
}) {
  const dispatch = useDispatch();

  const [createdTask, setCreatedTask] = useState<MockTask>({
    _id: new Date().getTime().toString(),
    assigned_user: project.assignedUsers[0],
    description: '',
    name: '',
    sprint: project.backlog._id,
    status: 'To-Do',
    dependentTasks: [],
    prereqForTasks: [],
    project: project._id,
    priority: 'Low',
    taskPoints: 1,
    relevantQuestions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='taskTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Task Title'
                defaultValue={createdTask.name}
                onChange={e => setCreatedTask({ ...createdTask, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId='taskSprint'>
              <Form.Label>Sprint</Form.Label>
              <Form.Select
                value={createdTask.sprint}
                onChange={e => setCreatedTask({ ...createdTask, sprint: e.target.value })}>
                <option value={project.backlog._id}>Backlog</option>
                {project.sprints.map(sprint => (
                  <option key={sprint._id} value={sprint._id}>
                    {sprint.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId='taskPriority'>
              <Form.Label>Priority</Form.Label>
              <Form.Select
                defaultValue='Low'
                onChange={e => setCreatedTask({ ...createdTask, priority: e.target.value })}>
                <option value='Low'>Low</option>
                <option value='Medium'>Medium</option>
                <option value='High'>High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId='taskUser'>
              <Form.Label>User</Form.Label>
              <Form.Select
                defaultValue={project.assignedUsers[0]}
                onChange={e => setCreatedTask({ ...createdTask, assigned_user: e.target.value })}>
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
                defaultValue='To-Do'
                onChange={e => setCreatedTask({ ...createdTask, status: e.target.value })}>
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
                defaultValue={1}
                onChange={e => setCreatedTask({ ...createdTask, taskPoints: +e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId='taskDescription'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                cols={50}
                placeholder='Enter Task Description'
                defaultValue=''
                onChange={e => setCreatedTask({ ...createdTask, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId='taskQuestions'>
              <Form.Label>Relevant FakeStackOverflow Questions</Form.Label>
              <Form.Select
                multiple
                defaultValue={[]}
                onChange={e =>
                  setCreatedTask({
                    ...createdTask,
                    relevantQuestions: Array.from(e.target.selectedOptions, option => option.value),
                  })
                }>
                <option value='1'>Question 1</option>
                <option value='2'>Question 2</option>
                <option value='3'>Question 3</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3' controlId='taskPrerequisites'>
              <Form.Label>Task Prerequisites</Form.Label>
              <Form.Select
                multiple
                defaultValue={[]}
                onChange={e =>
                  setCreatedTask({
                    ...createdTask,
                    prereqForTasks: Array.from(e.target.selectedOptions, option => option.value),
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
                  setCreatedTask({
                    ...createdTask,
                    dependentTasks: Array.from(e.target.selectedOptions, option => option.value),
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
              // Need to call the service to create a new Task
              dispatch(addNewTask(createdTask));
              setCreatedTask({
                _id: new Date().getTime().toString(),
                assigned_user: project.assignedUsers[0],
                description: '',
                name: '',
                sprint: project.backlog._id,
                status: 'To-Do',
                dependentTasks: [],
                prereqForTasks: [],
                project: project._id,
                priority: 'Low',
                taskPoints: 1,
                relevantQuestions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }); // Resetting the form
              handleClose();
            }}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
