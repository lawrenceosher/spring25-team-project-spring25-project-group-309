/* eslint-disable import/no-extraneous-dependencies */
import { Button, Card, FormGroup, FormLabel, FormSelect, ListGroup } from 'react-bootstrap';
import './index.css';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { useState } from 'react';
import TaskCreationModal from '../components/TaskCreationModal/TaskCreationModal';
import SprintCreationModal from '../components/SprintCreationModal/SprintCreationModal';
import TaskDeletionModal from '../components/TaskCreationModal/TaskDeletionModal';
import SprintDeletionModal from '../components/SprintCreationModal/SprintDeletionModal';
import SprintListGroup from '../components/SprintListGroup/SprintListGroup';
import { Project, Sprint, Task } from '../../../types/types';

const project1: Project = {
  _id: '1',
  assignedUsers: ['aayusht', 'losher', 'jasonl', 'jylahb'],
  description: '',
  name: 'Project Planning Tool',
  sprints: [],
};

const sprint1: Sprint = {
  tasks: [],
  name: 'First Project Sprint',
  project: project1._id,
  status: 'Done',
  start_date: new Date(2025, 1, 27),
  end_date: new Date(2025, 2, 12),
};

const sprint2: Sprint = {
  _id: new ObjectId(),
  tasks: [],
  name: 'Second Project Sprint',
  project: project1._id,
  status: 'In Progress',
  start_date: new Date(2025, 2, 13),
  end_date: new Date(2025, 2, 27),
};

const sprint3: Sprint = {
  _id: new ObjectId(),
  tasks: [],
  name: 'Third Project Sprint',
  project: project1._id,
  status: 'Not Started',
  start_date: new Date(2025, 2, 27),
  end_date: new Date(2025, 3, 9),
};

project1.sprints = [sprint1._id, sprint2._id, sprint3._id];

const task1: Task = {
  _id: new ObjectId(),
  assigned_user: 'aayusht',
  description: 'Create the relevant DB types, models, and schemas for Sprints, Tasks, and Projects',
  name: '[DB] Create DB Models',
  sprint: sprint1._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [],
  project: project1._id,
  priority: 5,
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task2: Task = {
  _id: new ObjectId(),
  assigned_user: 'losher',
  description:
    'Set up the routes to the sprint planning, kanban board, and project roadmap screen. Add in links to these routes on the navigation sidebar',
  name: '[UI] Navigation and Routing',
  sprint: sprint1._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id],
  project: project1._id,
  priority: 5,
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task3: Task = {
  _id: new ObjectId(),
  assigned_user: 'losher',
  description: 'Create a prototype for the Sprint Planning Page',
  name: '[UI] Sprint Planning Page Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id, task2._id],
  project: project1._id,
  priority: 5,
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task4: Task = {
  _id: new ObjectId(),
  assigned_user: 'losher',
  description: 'Create a prototype for the Kanban Board Page',
  name: '[UI] Kanban Board Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: [task1._id, task2._id],
  project: project1._id,
  priority: 5,
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task5: Task = {
  _id: new ObjectId(),
  assigned_user: 'jasonl',
  description: 'Create a prototype for the Project Roadmap Page',
  name: '[UI] Project Roadmap Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: [task1._id, task2._id],
  project: project1._id,
  priority: 5,
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task6: Task = {
  _id: new ObjectId(),
  assigned_user: 'jylahb',
  description: 'Create API Structure and enumerate different endpoints based on data models',
  name: '[API] Initial API Structure',
  sprint: sprint1._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id],
  project: project1._id,
  priority: 5,
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task7: Task = {
  _id: new ObjectId(),
  assigned_user: 'aayusht',
  description:
    'Create GET endpoint to populate sprint planning screen. Also must write Unit tests.',
  name: '[API] GET Endpoint Sprint Planning',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id, task5._id],
  project: project1._id,
  priority: 3,
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task8: Task = {
  _id: new ObjectId(),
  assigned_user: 'jasonl',
  description: 'Create POST Endpoint for creating new “sprints”. Include unit tests',
  name: '[API] POST Endpoint New Sprint',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id, task5._id],
  project: project1._id,
  priority: 3,
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task9: Task = {
  _id: new ObjectId(),
  assigned_user: 'losher',
  description: 'Create POST Endpoint for creating new tasks. Include unit tests',
  name: '[API] POST Endpoint New Task',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id, task5._id],
  project: project1._id,
  priority: 3,
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task10: Task = {
  _id: new ObjectId(),
  assigned_user: 'jylahb',
  description:
    'Create PUT Endpoint for assigning tasks from the overall task backlog to different sprints. Include unit tests',
  name: '[API] PUT Endpoint for assigning tasks from the overall task backlog to different sprints',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: [task1._id, task5._id],
  project: project1._id,
  priority: 3,
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

sprint1.tasks = [task1._id, task2._id, task3._id, task4._id, task5._id, task6._id];
sprint2.tasks = [task7._id, task8._id, task9._id, task10._id];

const DUMMY_TASKS_SPRINT1 = [task1, task2, task3, task4, task5, task6];
const DUMMY_TASKS_SPRINT2 = [task7, task8, task9, task10];

export default function SprintPlanningPage() {
  // Task Creation Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const handleCloseCreateTaskModal = () => setShowCreateTaskModal(false);
  const handleShowCreateTaskModal = () => setShowCreateTaskModal(true);

  // Sprint Creation Modal
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const handleCloseCreateSprintModal = () => setShowCreateSprintModal(false);
  const handleShowCreateSprintModal = () => setShowCreateSprintModal(true);

  // Sprint Deletion Modal
  const [showDeleteSprintModal, setShowDeleteSprintModal] = useState(false);
  const handleCloseDeleteSprintModal = () => setShowDeleteSprintModal(false);
  const handleShowDeleteSprintModal = () => setShowDeleteSprintModal(true);

  // Task Deletion Modal
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const handleCloseDeleteTaskModal = () => setShowDeleteTaskModal(false);
  const handleShowDeleteTaskModal = () => setShowDeleteTaskModal(true);

  return (
    <div className='p-3'>
      <div id='sprint-planning-header' className='d-flex align-items-center'>
        <h1 className='fw-bold d-flex flex-fill'>Project Name - Sprint Planning</h1>
        <span>
          <FormGroup className='d-inline-flex me-3 align-middle'>
            <div>
              <FormLabel>Filter by User:</FormLabel>
              {/* Insert list of users in the project here */}
              <FormSelect>
                <option value='User 1'>User 1</option>
                <option value='User 2'>User 2</option>
                <option value='User 3'>User 3</option>
              </FormSelect>
            </div>
          </FormGroup>
          <Button size='lg' className='me-2' onClick={handleShowCreateSprintModal}>
            + Create Sprint
          </Button>
          <Button size='lg' variant='success' onClick={handleShowCreateTaskModal}>
            + Create Task
          </Button>
        </span>
      </div>

      <TaskCreationModal show={showCreateTaskModal} handleClose={handleCloseCreateTaskModal} />
      <SprintCreationModal
        show={showCreateSprintModal}
        handleClose={handleCloseCreateSprintModal}
      />
      <TaskDeletionModal
        show={showDeleteTaskModal}
        handleClose={handleCloseDeleteTaskModal}
        taskTitle='Task 1'
      />
      <SprintDeletionModal
        show={showDeleteSprintModal}
        handleClose={handleCloseDeleteSprintModal}
        sprintTitle='Sprint 1'
      />

      <div className='mt-4 d-flex'>
        <div id='sprints' className='flex-fill'>
          <SprintListGroup
            sprint={sprint1}
            tasks={DUMMY_TASKS_SPRINT1}
            handleShowDeleteSprintModal={handleShowDeleteSprintModal}
          />

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Sprint Title 2</span>
                <span className='ms-4 text-muted'>3/13/25 - 3/27/25</span>
                <div className='float-end'>
                  <span className='me-3 rounded-pill p-2 bg-info-subtle'>In Progress</span>
                  <span className='me-3 bg-primary-subtle p-2 rounded-pill'>5</span>
                  <FaPencil className='text-primary me-3' />
                  <FaTrash className='text-danger me-1' />
                </div>
              </div>
              <ListGroup className='rounded-0'>
                <ListGroup.Item>
                  <span>Task 1</span>
                  <div className='float-end'>
                    <span className='bg-danger-subtle p-2 rounded-pill fs-6 me-1'>To-Do</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Task 2</span>
                  <div className='float-end'>
                    <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>1</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Task 3</span>
                  <div className='float-end'>
                    <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Sprint Title 3</span>
                <span className='ms-4 text-muted'>3/27/25 - 4/9/25</span>
                <div className='float-end'>
                  <span className='me-3 rounded-pill p-2 bg-success-subtle'>Finished</span>
                  <span className='me-3 bg-primary-subtle p-2 rounded-pill'>5</span>
                  <FaPencil className='text-primary me-3' />
                  <FaTrash className='text-danger me-1' />
                </div>
              </div>
              <ListGroup className='rounded-0'>
                <ListGroup.Item>
                  <span>Task 1</span>
                  <div className='float-end'>
                    <span className='bg-danger-subtle p-2 rounded-pill fs-6 me-1'>To-Do</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Task 2</span>
                  <div className='float-end'>
                    <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>1</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Task 3</span>
                  <div className='float-end'>
                    <span className='bg-info-subtle p-2 rounded-pill fs-6 me-1'>In Progress</span>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>2</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>

          <ListGroup className='rounded-0 '>
            <ListGroup.Item className='p-0 mb-5 fs-5 border-gray'>
              <div id='sprint-header' className='p-3 ps-2 bg-light'>
                <span>Backlog</span>
                <div className='float-end'>
                  <span className='bg-primary-subtle p-2 rounded-pill'>20</span>
                </div>
              </div>
              <ListGroup className='rounded-0'>
                <ListGroup.Item>
                  <span>Backlog Task 1</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>10</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 2</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>Backlog Task 3</span>
                  <div className='float-end'>
                    <span className='bg-primary-subtle p-2 rounded-pill fs-6'>5</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div id='task-details' className='ms-3'>
          <Card>
            <Card.Body>
              <Card.Title className='fs-4'>
                Task Title{' '}
                <span className='float-end'>
                  <FaPencil className='text-primary me-3' />
                  <FaTrash className='text-danger me-1' onClick={handleShowDeleteTaskModal} />
                </span>
              </Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>Sprint 1</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Priority: High</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Assigned To: Username</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Status: In Progress</Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>Task Points: 5</Card.Subtitle>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the
                card&apos;s content. The description of the Task will go here Some quick example
                text to build on the card title and make up the bulk of the card&apos;s content. The
                description of the Task will go here Some quick example text to build on the card
                title and make up the bulk of the card&apos;s content. The description of the Task
                will go here.
              </Card.Text>
              <Card.Footer>
                <span>Relevant Fake Stack Overflow Questions:</span>
                <ListGroup variant='flush' className='mt-2'>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 1</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 2</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>StackOverflow Question 3</Card.Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
              <Card.Footer>
                <span>Task Dependencies:</span>
                <ListGroup variant='flush' className='mt-2'>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 1</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 2</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 3</Card.Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
              <Card.Footer>
                <span>Task Prerequisites:</span>
                <ListGroup variant='flush' className='mt-2'>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 1</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 2</Card.Link>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-transparent p-1'>
                    <Card.Link href='#'>Task 3</Card.Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
