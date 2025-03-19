import { useState } from 'react';
import { MockProject } from '../types/mockTypes/project';
import { MockSprint } from '../types/mockTypes/sprint';
import { MockTask } from '../types/mockTypes/task';

const useSprintPlanningPage = () => {
  const project1: MockProject = {
    _id: 'P1',
    assignedUsers: ['aayusht', 'losher', 'jasonl', 'jylahb'],
    description: '',
    name: 'Example Project',
    sprints: [],
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
    description:
      'Create the relevant DB types, models, and schemas for Sprints, Tasks, and Projects',
    name: '[DB] Create DB Models',
    sprint: sprint1._id,
    status: 'Done',
    dependentTasks: [],
    prereqForTasks: [],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1, task2],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1, task2],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1, task2],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1],
    project: project1._id,
    priority: 5,
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
    prereqForTasks: [task1, task5],
    project: project1._id,
    priority: 3,
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
    prereqForTasks: [task1, task5],
    project: project1._id,
    priority: 3,
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
    prereqForTasks: [task1, task5],
    project: project1._id,
    priority: 3,
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
    prereqForTasks: [task1, task5],
    project: project1._id,
    priority: 3,
    taskPoints: 1,
    relevantQuestions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  sprint1.tasks = [task1, task2, task3, task4, task5, task6];
  sprint2.tasks = [task7, task8, task9, task10];

  const [project, setProject] = useState<MockProject>(project1);

  return { project, sprint1 };
};

export default useSprintPlanningPage;
