import { populateDocument } from '../../utils/database.util';
import QuestionModel from '../../models/questions.model';
import AnswerModel from '../../models/answers.model';
import ChatModel from '../../models/chat.model';
import UserModel from '../../models/users.model';
import SprintModel from '../../models/sprint.model';
import ProjectModel from '../../models/project.model';
import TaskModel from '../../models/task.model';

jest.mock('../../models/questions.model');
jest.mock('../../models/answers.model');
jest.mock('../../models/chat.model');
jest.mock('../../models/messages.model');
jest.mock('../../models/users.model');
jest.mock('../../models/tags.model');
jest.mock('../../models/comments.model');
jest.mock('../../models/sprint.model');
jest.mock('../../models/task.model');
jest.mock('../../models/project.model');

describe('populateDocument', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and populate a question document', async () => {
    const mockQuestion = {
      _id: 'questionId',
      tags: ['tagId'],
      answers: ['answerId'],
      comments: ['commentId'],
    };
    (QuestionModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockQuestion),
    });

    const result = await populateDocument('questionId', 'question');

    expect(QuestionModel.findOne).toHaveBeenCalledWith({ _id: 'questionId' });
    expect(result).toEqual(mockQuestion);
  });

  it('should return an error message if question document is not found', async () => {
    (QuestionModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const questionID = 'invalidQuestionId';
    const result = await populateDocument(questionID, 'question');

    expect(result).toEqual({
      error: `Error when fetching and populating a document: Failed to fetch and populate question with ID: ${
        questionID
      }`,
    });
  });

  it('should return an error message if fetching a question document throws an error', async () => {
    (QuestionModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await populateDocument('questionId', 'question');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Database error',
    });
  });

  it('should fetch and populate an answer document', async () => {
    const mockAnswer = {
      _id: 'answerId',
      comments: ['commentId'],
    };
    (AnswerModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAnswer),
    });

    const result = await populateDocument('answerId', 'answer');

    expect(AnswerModel.findOne).toHaveBeenCalledWith({ _id: 'answerId' });
    expect(result).toEqual(mockAnswer);
  });

  it('should return an error message if answer document is not found', async () => {
    (AnswerModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const answerID = 'invalidAnswerId';
    const result = await populateDocument(answerID, 'answer');

    expect(result).toEqual({
      error: `Error when fetching and populating a document: Failed to fetch and populate answer with ID: ${
        answerID
      }`,
    });
  });

  it('should return an error message if fetching an answer document throws an error', async () => {
    (AnswerModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await populateDocument('answerId', 'answer');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Database error',
    });
  });

  it('should fetch and populate a chat document', async () => {
    const mockChat = {
      _id: 'chatId',
      messages: [
        {
          _id: 'messageId',
          msg: 'Hello',
          msgFrom: 'user1',
          msgDateTime: new Date(),
          type: 'text',
        },
      ],
      toObject: jest.fn().mockReturnValue({
        _id: 'chatId',
        messages: [
          {
            _id: 'messageId',
            msg: 'Hello',
            msgFrom: 'user1',
            msgDateTime: new Date(),
            type: 'text',
          },
        ],
      }),
    };
    const mockUser = {
      _id: 'userId',
      username: 'user1',
    };
    (ChatModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockChat),
    });
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await populateDocument('chatId', 'chat');

    expect(ChatModel.findOne).toHaveBeenCalledWith({ _id: 'chatId' });
    expect(result).toEqual({
      ...mockChat.toObject(),
      messages: [
        {
          _id: 'messageId',
          msg: 'Hello',
          msgFrom: 'user1',
          msgDateTime: mockChat.messages[0].msgDateTime,
          type: 'text',
          user: {
            _id: 'userId',
            username: 'user1',
          },
        },
      ],
    });
  });

  it('should return an error message if chat document is not found', async () => {
    (ChatModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const result = await populateDocument('invalidChatId', 'chat');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Chat not found',
    });
  });

  it('should return an error message if fetching a chat document throws an error', async () => {
    (ChatModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await populateDocument('chatId', 'chat');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Database error',
    });
  });

  it('should return an error message if type is invalid', async () => {
    const invalidType = 'invalidType' as 'question' | 'answer' | 'chat';
    const result = await populateDocument('someId', invalidType);
    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Invalid type provided.',
    });
  });

  it('should fetch and populate a sprint document', async () => {
    const mockSprint = {
      _id: 'sprintId',
      tasks: ['taskId'],
    };
    const mockTask = {
      _id: 'taskId',
      name: 'Task 1',
      description: 'Description of task',
    };

    (SprintModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSprint),
    });
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockTask),
    });

    const result = await populateDocument('sprintId', 'sprint');

    expect(SprintModel.findOne).toHaveBeenCalledWith({ _id: 'sprintId' });
    expect(result).toEqual({
      ...mockSprint,
      tasks: [mockTask],
    });
  });

  it('should return an error message if sprint document is not found', async () => {
    (SprintModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const result = await populateDocument('invalidSprintId', 'sprint');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Sprint not found',
    });
  });

  it('should return an error message if fetching a sprint document throws an error', async () => {
    (SprintModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await populateDocument('sprintId', 'sprint');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Database error',
    });
  });

  it('should fetch and populate a project document', async () => {
    const mockProject = {
      _id: 'projectId',
      backlogTasks: ['taskId'],
      sprints: ['sprintId'],
    };

    // Mock Question Data
    const mockQuestion = {
      _id: 'questionId',
      title: 'What is the purpose of this task?',
      text: 'This task is intended to test the feature integration.',
      tags: ['integration', 'testing'],
      askedBy: 'user1',
      askDateTime: new Date(),
      answers: [],
      views: ['user1', 'user2'],
      upVotes: ['user1'],
      downVotes: ['user3'],
      comments: [],
    };

    // Mock Task Data with relevant fields (only IDs for prereqTasks, dependentTasks, and relevantQuestions)
    const mockTask = {
      _id: 'taskId',
      name: 'Backlog Task 1',
      description: 'Description of backlog task',
      assignedUser: undefined,
      createdAt: undefined,
      dependentTasks: ['dependentTaskId'], // Just the ID
      prereqTasks: ['prereqTaskId'], // Just the ID
      priority: undefined,
      project: undefined,
      relevantQuestions: ['questionId'], // Just the ID
      sprint: undefined,
      status: undefined,
      taskPoints: undefined,
      updatedAt: undefined,
    };

    // Mock Sprint Data with task references
    const mockSprint = {
      _id: 'sprintId',
      name: 'Sprint 1',
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      project: undefined,
      tasks: ['taskId'],
    };

    // Mock data for dependent and prereq tasks
    const mockDependentTask = {
      _id: 'dependentTaskId',
      name: 'Dependent Task',
      description: 'Description of dependent task',
    };
    const mockPrereqTask = {
      _id: 'prereqTaskId',
      name: 'Prerequisite Task',
      description: 'Description of prerequisite task',
    };

    // Mocks for DB findOne behavior
    (ProjectModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockProject),
    });

    // Mock population for questions, dependent tasks, and prereq tasks
    (TaskModel.findOne as jest.Mock).mockImplementation(({ _id }) => {
      if (_id === 'taskId') {
        return {
          populate: jest.fn().mockResolvedValue({
            ...mockTask,
            // Keeping dependentTasks, prereqTasks, and relevantQuestions as just IDs
            dependentTasks: ['dependentTaskId'],
            prereqTasks: ['prereqTaskId'],
            relevantQuestions: ['questionId'],
          }),
        };
      }
      if (_id === 'dependentTaskId') {
        return {
          populate: jest.fn().mockResolvedValue(mockDependentTask),
        };
      }
      if (_id === 'prereqTaskId') {
        return {
          populate: jest.fn().mockResolvedValue(mockPrereqTask),
        };
      }
      return {
        populate: jest.fn().mockResolvedValue(mockTask),
      };
    });

    (SprintModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSprint),
    });
    (QuestionModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockQuestion),
    });

    const result = await populateDocument('projectId', 'project');

    expect(ProjectModel.findOne).toHaveBeenCalledWith({ _id: 'projectId' });
    expect(result).toEqual({
      ...mockProject,
      backlogTasks: [
        {
          _id: 'taskId',
          name: 'Backlog Task 1',
          description: 'Description of backlog task',
          assignedUser: undefined,
          createdAt: undefined,
          dependentTasks: ['dependentTaskId'], // Still just IDs
          prereqTasks: ['prereqTaskId'], // Still just IDs
          relevantQuestions: ['questionId'], // Still just IDs
          status: undefined,
          taskPoints: undefined,
          updatedAt: undefined,
        },
      ],
      sprints: [
        {
          _id: 'sprintId',
          name: 'Sprint 1',
          tasks: [
            {
              _id: 'taskId',
              name: 'Backlog Task 1',
              description: 'Description of backlog task',
              assignedUser: undefined,
              createdAt: undefined,
              dependentTasks: ['dependentTaskId'], // Still just IDs
              prereqTasks: ['prereqTaskId'], // Still just IDs
              relevantQuestions: ['questionId'], // Still just IDs
              status: undefined,
              taskPoints: undefined,
              updatedAt: undefined,
            },
          ],
        },
      ],
    });
  });

  it('should return an error message if project document is not found', async () => {
    (ProjectModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const result = await populateDocument('invalidProjectId', 'project');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Project not found',
    });
  });

  it('should return an error message if fetching a project document throws an error', async () => {
    (ProjectModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await populateDocument('projectId', 'project');

    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Database error',
    });
  });

  it('should return an error message if type is invalid for sprint or project', async () => {
    const invalidType = 'invalidType' as 'question' | 'answer' | 'chat' | 'sprint' | 'project';
    const result = await populateDocument('someId', invalidType);
    expect(result).toEqual({
      error: 'Error when fetching and populating a document: Invalid type provided.',
    });
  });
});
