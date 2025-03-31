import { MockProject } from '../types/clientTypes/project';
import { ClientSprint } from '../types/clientTypes/sprint';
import { ClientTask } from '../types/clientTypes/task';

const project1: MockProject = {
  _id: 'P1',
  assignedUsers: ['aayusht', 'losher', 'jasonl', 'jylahb'],
  description: '',
  name: 'Example Project',
  sprints: [],
  backlogTasks: [],
};

const sprint1: ClientSprint = {
  _id: 'S1',
  tasks: [],
  name: 'First Project Sprint',
  project: project1._id,
  status: 'Done',
  startDate: new Date(2025, 1, 27),
  endDate: new Date(2025, 2, 12),
};

const sprint2: ClientSprint = {
  _id: 'S2',
  tasks: [],
  name: 'Second Project Sprint',
  project: project1._id,
  status: 'In Progress',
  startDate: new Date(2025, 2, 13),
  endDate: new Date(2025, 2, 27),
};

const sprint3: ClientSprint = {
  _id: 'S3',
  tasks: [],
  name: 'Third Project Sprint',
  project: project1._id,
  status: 'Not Started',
  startDate: new Date(2025, 2, 27),
  endDate: new Date(2025, 3, 9),
};

project1.sprints = [sprint1, sprint2, sprint3];

const task1: ClientTask = {
  _id: 'T1',
  assignedUser: 'aayusht',
  description: 'Create the relevant DB types, models, and schemas for Sprints, Tasks, and Projects',
  name: '[DB] Create DB Models',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: ['T2', 'T3', 'T4', 'T5', 'T6'],
  prereqTasks: [],
  project: project1._id,
  priority: 'High',
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task2: ClientTask = {
  _id: 'T2',
  assignedUser: 'losher',
  description:
    'Set up the routes to the sprint planning, kanban board, and project roadmap screen. Add in links to these routes on the navigation sidebar',
  name: '[UI] Navigation and Routing',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqTasks: ['T1'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task3: ClientTask = {
  _id: 'T3',
  assignedUser: 'losher',
  description: 'Create a prototype for the Sprint Planning Page',
  name: '[UI] Sprint Planning Page Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task4: ClientTask = {
  _id: 'T4',
  assignedUser: 'losher',
  description: 'Create a prototype for the Kanban Board Page',
  name: '[UI] Kanban Board Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'To-Do',
  dependentTasks: [],
  prereqTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task5: ClientTask = {
  _id: 'T5',
  assignedUser: 'jasonl',
  description: 'Create a prototype for the Project Roadmap Page',
  name: '[UI] Project Roadmap Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task6: ClientTask = {
  _id: 'T6',
  assignedUser: 'jylahb',
  description: 'Create API Structure and enumerate different endpoints based on data models',
  name: '[API] Initial API Structure',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqTasks: ['T1'],
  project: project1._id,
  priority: 'High',
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task7: ClientTask = {
  _id: 'T7',
  assignedUser: 'aayusht',
  description:
    'Create GET endpoint to populate sprint planning screen. Also must write Unit tests.',
  name: '[API] GET Endpoint Sprint Planning',
  sprint: sprint2._id,
  status: 'To-Do',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task8: ClientTask = {
  _id: 'T8',
  assignedUser: 'jasonl',
  description: 'Create POST Endpoint for creating new “sprints”. Include unit tests',
  name: '[API] POST Endpoint New Sprint',
  sprint: sprint2._id,
  status: 'To-Do',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task9: ClientTask = {
  _id: 'T9',
  assignedUser: 'losher',
  description: 'Create POST Endpoint for creating new tasks. Include unit tests',
  name: '[API] POST Endpoint New Task',
  sprint: sprint2._id,
  status: 'To-Do',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task10: ClientTask = {
  _id: 'T10',
  assignedUser: 'jylahb',
  description:
    'Create PUT Endpoint for assigning tasks from the overall task backlog to different sprints. Include unit tests',
  name: '[API] PUT Endpoint for assigning tasks from the overall task backlog to different sprints',
  sprint: sprint2._id,
  status: 'To-Do',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task11: ClientTask = {
  _id: 'T11',
  assignedUser: 'jasonl',
  description: 'PUT Endpoint for moving tasks from one sprint to another. Include unit tests',
  name: '[API] PUT Endpoint - TaskSprint',
  sprint: sprint3._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task12: ClientTask = {
  _id: 'T12',
  assignedUser: 'losher',
  description:
    'React Drag and Drop to move tasks from one sprint to another, and tasks from one progress column to another',
  name: '[UI] React Drag and Drop',
  sprint: null,
  status: 'In Progress',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task13: ClientTask = {
  _id: 'T13',
  assignedUser: 'losher',
  description: 'Make Sprint Planning and Board screens more dynamic to ready connection to API',
  name: '[UI] Dynamic Sprint Planning and Board',
  sprint: null,
  status: 'In Progress',
  dependentTasks: [],
  prereqTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

sprint1.tasks = [task1, task2, task3, task4, task5, task6];
sprint2.tasks = [task7, task8, task9, task10];
sprint3.tasks = [task11];
project1.backlogTasks = [task12, task13];

export {
  project1,
  sprint1,
  sprint2,
  sprint3,
  task1,
  task2,
  task3,
  task4,
  task5,
  task6,
  task7,
  task8,
  task9,
  task10,
};
