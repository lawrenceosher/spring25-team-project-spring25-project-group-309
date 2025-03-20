import { MockBacklog } from '../types/mockTypes/backlog';
import { MockProject } from '../types/mockTypes/project';
import { MockSprint } from '../types/mockTypes/sprint';
import { MockTask } from '../types/mockTypes/task';

const backlog: MockBacklog = {
  _id: 'B1',
  tasks: [],
};

const project1: MockProject = {
  _id: 'P1',
  assignedUsers: ['aayusht', 'losher', 'jasonl', 'jylahb'],
  description: '',
  name: 'Example Project',
  sprints: [],
  backlog,
};

const sprint1: MockSprint = {
  _id: 'S1',
  tasks: [],
  name: 'First Project Sprint',
  project: project1._id,
  status: 'Done',
  start_date: new Date(2025, 1, 27),
  end_date: new Date(2025, 2, 12),
};

const sprint2: MockSprint = {
  _id: 'S2',
  tasks: [],
  name: 'Second Project Sprint',
  project: project1._id,
  status: 'In Progress',
  start_date: new Date(2025, 2, 13),
  end_date: new Date(2025, 2, 27),
};

const sprint3: MockSprint = {
  _id: 'S3',
  tasks: [],
  name: 'Third Project Sprint',
  project: project1._id,
  status: 'Not Started',
  start_date: new Date(2025, 2, 27),
  end_date: new Date(2025, 3, 9),
};

project1.sprints = [sprint1, sprint2, sprint3];

const task1: MockTask = {
  _id: 'T1',
  assigned_user: 'aayusht',
  description: 'Create the relevant DB types, models, and schemas for Sprints, Tasks, and Projects',
  name: '[DB] Create DB Models',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: ['T2', 'T3', 'T4', 'T5', 'T6'],
  prereqForTasks: [],
  project: project1._id,
  priority: 'High',
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task2: MockTask = {
  _id: 'T2',
  assigned_user: 'losher',
  description:
    'Set up the routes to the sprint planning, kanban board, and project roadmap screen. Add in links to these routes on the navigation sidebar',
  name: '[UI] Navigation and Routing',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqForTasks: ['T1'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task3: MockTask = {
  _id: 'T3',
  assigned_user: 'losher',
  description: 'Create a prototype for the Sprint Planning Page',
  name: '[UI] Sprint Planning Page Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task4: MockTask = {
  _id: 'T4',
  assigned_user: 'losher',
  description: 'Create a prototype for the Kanban Board Page',
  name: '[UI] Kanban Board Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task5: MockTask = {
  _id: 'T5',
  assigned_user: 'jasonl',
  description: 'Create a prototype for the Project Roadmap Page',
  name: '[UI] Project Roadmap Initial Layout/Skeleton',
  sprint: sprint1._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T2'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task6: MockTask = {
  _id: 'T6',
  assigned_user: 'jylahb',
  description: 'Create API Structure and enumerate different endpoints based on data models',
  name: '[API] Initial API Structure',
  sprint: sprint1._id,
  status: 'Done',
  dependentTasks: [],
  prereqForTasks: ['T1'],
  project: project1._id,
  priority: 'High',
  taskPoints: 3,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task7: MockTask = {
  _id: 'T7',
  assigned_user: 'aayusht',
  description:
    'Create GET endpoint to populate sprint planning screen. Also must write Unit tests.',
  name: '[API] GET Endpoint Sprint Planning',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task8: MockTask = {
  _id: 'T8',
  assigned_user: 'jasonl',
  description: 'Create POST Endpoint for creating new “sprints”. Include unit tests',
  name: '[API] POST Endpoint New Sprint',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task9: MockTask = {
  _id: 'T9',
  assigned_user: 'losher',
  description: 'Create POST Endpoint for creating new tasks. Include unit tests',
  name: '[API] POST Endpoint New Task',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task10: MockTask = {
  _id: 'T10',
  assigned_user: 'jylahb',
  description:
    'Create PUT Endpoint for assigning tasks from the overall task backlog to different sprints. Include unit tests',
  name: '[API] PUT Endpoint for assigning tasks from the overall task backlog to different sprints',
  sprint: sprint2._id,
  status: 'Not Started',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task11: MockTask = {
  _id: 'T11',
  assigned_user: 'jasonl',
  description: 'PUT Endpoint for moving tasks from one sprint to another. Include unit tests',
  name: '[API] PUT Endpoint - TaskSprint',
  sprint: sprint3._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 1,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task12: MockTask = {
  _id: 'T12',
  assigned_user: 'losher',
  description:
    'React Drag and Drop to move tasks from one sprint to another, and tasks from one progress column to another',
  name: '[UI] React Drag and Drop',
  sprint: backlog._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
  project: project1._id,
  priority: 'High',
  taskPoints: 2,
  relevantQuestions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const task13: MockTask = {
  _id: 'T13',
  assigned_user: 'losher',
  description: 'Make Sprint Planning and Board screens more dynamic to ready connection to API',
  name: '[UI] Dynamic Sprint Planning and Board',
  sprint: backlog._id,
  status: 'In Progress',
  dependentTasks: [],
  prereqForTasks: ['T1', 'T5'],
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
backlog.tasks = [task12, task13];

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
  backlog,
};
