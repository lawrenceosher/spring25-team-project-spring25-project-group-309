import { ObjectId } from 'mongodb';
import TaskModel from '../../models/task.model';
import {
  deleteTaskById,
  getAllTasksByUser,
  saveTask,
  updateTask,
  addTaskToProject,
  propogateTaskToSprint,
} from '../../services/task.service';
import { databaseTask, databaseTaskWithDependency } from '../mockData.models';
import { DatabaseTask } from '../../types/types';
import SprintModel from '../../models/sprint.model';
import ProjectModel from '../../models/project.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

// eslint-disable-next-line @typescript-eslint/naming-convention
const mockDependentTasks: DatabaseTask[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    assignedUser: 'user1',
    description: 'Dep task 1',
    name: 'Task 1',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc'),
    status: 'todo',
    dependentTasks: [],
    prereqTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc'),
    priority: 'high',
    taskPoints: 3,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00'),
    updatedAt: new Date('2023-11-18T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
    assignedUser: 'user2',
    description: 'Dep task 2',
    name: 'Task 2',
    sprint: new ObjectId('47e9b58310afe6e94fc2e9dc'),
    status: 'in progress',
    dependentTasks: [],
    prereqTasks: [],
    project: new ObjectId('15e9b58310afe6e94fc6e6dc'),
    priority: 'medium',
    taskPoints: 5,
    relevantQuestions: [],
    createdAt: new Date('2023-11-18T09:24:00'),
    updatedAt: new Date('2023-11-18T09:24:00'),
  },
];

describe('Task model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  afterAll(() => {
    mockingoose.resetAll();
  });

  describe('getAllTasksByUser', () => {
    it('should return the tasks for the user', async () => {
      mockingoose(TaskModel).toReturn([databaseTask], 'find');
      const tasks = await getAllTasksByUser('test');
      expect(tasks).toEqual([databaseTask]);
    });

    it('should return an error if the user is not found', async () => {
      mockingoose(TaskModel).toReturn(null, 'find');
      const tasks = await getAllTasksByUser('test');
      expect(tasks).toEqual([{ error: 'Error when getting tasks' }]);
    });
  });

  describe('updateTasks', () => {
    it('should return the updated task when adding tasks', async () => {
      const taskId = '65e9b58910afe6e94fc6e6dc';

      // Mock findOne to return task
      mockingoose(TaskModel).toReturn(databaseTaskWithDependency, 'findOne');
      // Mock changing sprints
      mockingoose(SprintModel).toReturn({}, 'findOneAndUpdate');
      // Mock moving to project backlog
      mockingoose(ProjectModel).toReturn({}, 'findOneAndUpdate');
      // Mock removing from project backlog
      mockingoose(TaskModel).toReturn(databaseTaskWithDependency, 'findOneAndUpdate');
      // Mock adding Task to new sprint
      mockingoose(ProjectModel).toReturn({}, 'updateMany');

      const updatedTask = await updateTask(taskId, {
        dependentTasks: [new ObjectId('65e9b58910afe6e94fc6e6de')],
      });

      expect(updatedTask).toEqual(databaseTaskWithDependency);
    });

    it('should return the updated task when removing tasks', async () => {
      const taskId = '65e9b58910afe6e94fc6e6dc';

      // Mock findOne to return task
      mockingoose(TaskModel).toReturn(databaseTask, 'findOne');
      // Mock changing sprints
      mockingoose(TaskModel).toReturn(databaseTask, 'findOneAndUpdate');
      // Mock moving to project backlog
      mockingoose(SprintModel).toReturn({}, 'findOneAndUpdate');
      // Mock removing from project backlog
      mockingoose(ProjectModel).toReturn({}, 'findOneAndUpdate');
      // Mock adding Task to new sprint
      mockingoose(ProjectModel).toReturn({}, 'updateMany');

      const updatedTask = await updateTask(taskId, {
        dependentTasks: [],
      });

      expect(updatedTask).not.toEqual(databaseTaskWithDependency);
      expect(updatedTask).toEqual(databaseTask);
    });
    it('should remove from the old sprint and add to the new one', async () => {
      const taskId = '65e9b58910afe6e94fc6e6dc';

      mockingoose(TaskModel).toReturn(databaseTask, 'findOne');
      mockingoose(SprintModel).toReturn({}, 'findOneAndUpdate');
      mockingoose(ProjectModel).toReturn({}, 'findOneAndUpdate');
      mockingoose(ProjectModel).toReturn({}, 'updateMany');

      const updatedTask = await updateTask(taskId, {
        sprint: new ObjectId('47e9b58310afe6e94fc2e9dc'),
      });

      expect(updatedTask).not.toEqual(databaseTask);
    });

    it('should return an error if the task is not found', async () => {
      mockingoose(TaskModel).toReturn(null, 'findOneAndUpdate');
      const updatedTask = await updateTask('test', {
        dependentTasks: [new ObjectId('65e9b58910afe6e94fc6e6de')],
      });
      expect('error' in updatedTask).toBe(true);
    });
  });

  describe('saveTask', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the task when successfully saving it', async () => {
      mockingoose(TaskModel).toReturn(databaseTask, 'create');
      const task = ((await saveTask(databaseTask)) as DatabaseTask) || {};
      expect(task.name).toEqual(databaseTask.name);
      expect(task.description).toEqual(databaseTask.description);
      expect(task.assignedUser).toEqual(databaseTask.assignedUser);
      expect(task.sprint).toEqual(databaseTask.sprint);
      expect(task.status).toEqual(databaseTask.status);
      expect(task.dependentTasks).toEqual(databaseTask.dependentTasks);
      expect(task.prereqTasks).toEqual(databaseTask.prereqTasks);
      expect(task.project).toEqual(databaseTask.project);
    });
    it('should return an error if the task is not found', async () => {
      jest
        .spyOn(TaskModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));
      const task = await saveTask(databaseTask);
      expect('error' in task).toBe(true);
    });
    it('should add to task to project if no sprint is provided', async () => {
      mockingoose(TaskModel).toReturn(databaseTask, 'create');
      mockingoose(ProjectModel).toReturn({}, 'findOneAndUpdate');
      const task = ((await saveTask(databaseTask)) as DatabaseTask) || {};
      expect(task.name).toEqual(databaseTask.name);
      expect(task.description).toEqual(databaseTask.description);
      expect(task.assignedUser).toEqual(databaseTask.assignedUser);
      expect(task.sprint).toEqual(databaseTask.sprint);
    });
  });

  describe('addTaskToProject', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated project when successfully adding task to project', async () => {
      const projectId = '65e9b58910afe6e94fc6e6dc';
      const taskId = '65e9b58910afe6e94fc6e6de';
      const updatedProject = {
        _id: new ObjectId(projectId),
        name: 'Project 1',
        description: 'Project description',
        backlogTasks: [new ObjectId(taskId)],
        sprints: [],
        assignedUsers: ['user1'],
      };
      mockingoose(ProjectModel).toReturn(updatedProject, 'findOne');
      mockingoose(ProjectModel).toReturn(updatedProject, 'findOneAndUpdate');
      const result = await addTaskToProject(new ObjectId(taskId), new ObjectId(projectId));
      expect(result).toEqual(updatedProject);
    });
    it('should return an error if the project is not found', async () => {
      const projectId = '65e9b58910afe6e94fc6e6dc';
      const taskId = '65e9b58910afe6e94fc6e6de';
      jest.spyOn(ProjectModel, 'findById').mockResolvedValue(null);
      const result = await addTaskToProject(new ObjectId(taskId), new ObjectId(projectId));
      expect('error' in result).toBe(true);
    });

    it('should return an error if there is an error while updating the project', async () => {
      const projectId = '65e9b58910afe6e94fc6e6dc';
      const taskId = '65e9b58910afe6e94fc6e6de';
      mockingoose(ProjectModel).toReturn(new Error('Error updating project'), 'findByIdAndUpdate');
      const result = await addTaskToProject(new ObjectId(taskId), new ObjectId(projectId));
      expect('error' in result).toBe(true);
    });
  });

  describe('deleteTasks', () => {
    it('should return the deletedTask when succesfully deleting them', async () => {
      mockingoose(TaskModel).toReturn(databaseTask, 'findOneAndDelete');
      const deletedTask = await deleteTaskById('65e9b58910afe6e94fc6e6dc');
      expect(deletedTask).toEqual(databaseTask);
    });

    it('should return an error if the task is not found', async () => {
      mockingoose(TaskModel).toReturn(null, 'findOneAndDelete');
      const deletedTask = await deleteTaskById('test');
      expect('error' in deletedTask).toBe(true);
    });
  });
});
