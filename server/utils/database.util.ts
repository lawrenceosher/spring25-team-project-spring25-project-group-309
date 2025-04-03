import { ObjectId } from 'mongodb';
import {
  DatabaseComment,
  DatabaseMessage,
  DatabaseTag,
  DatabaseUser,
  MessageInChat,
  DatabaseTask,
  DatabaseQuestion,
  PopulatedDatabaseAnswer,
  PopulatedDatabaseChat,
  PopulatedDatabaseQuestion,
  PopulatedDatabaseSprint,
  Task,
  PopulatedDatabaseTask,
  SprintResponse,
  PopulatedDatabaseProject,
  DatabaseSprint,
  ProjectResponse,
} from '../types/types';
import AnswerModel from '../models/answers.model';
import QuestionModel from '../models/questions.model';
import TagModel from '../models/tags.model';
import CommentModel from '../models/comments.model';
import ChatModel from '../models/chat.model';
import UserModel from '../models/users.model';
import MessageModel from '../models/messages.model';
import SprintModel from '../models/sprint.model';
import TaskModel from '../models/task.model';
import ProjectModel from '../models/project.model';

/**
 * Fetches and populates a question document with its related tags, answers, and comments.
 *
 * @param {string} questionID - The ID of the question to fetch.
 * @returns {Promise<PopulatedDatabaseQuestion | null>} - The populated question document, or null if not found.
 */
const populateQuestion = async (questionID: string): Promise<PopulatedDatabaseQuestion | null> => {
  const result = await QuestionModel.findOne({ _id: questionID }).populate<{
    tags: DatabaseTag[];
    answers: PopulatedDatabaseAnswer[];
    comments: DatabaseComment[];
  }>([
    { path: 'tags', model: TagModel },
    {
      path: 'answers',
      model: AnswerModel,
      populate: { path: 'comments', model: CommentModel },
    },
    { path: 'comments', model: CommentModel },
  ]);

  return result;
};

/**
 * Fetches and populates an answer document with its related comments.
 *
 * @param {string} answerID - The ID of the answer to fetch.
 * @returns {Promise<PopulatedDatabaseAnswer | null>} - The populated answer document, or null if not found.
 */
const populateAnswer = async (answerID: string): Promise<PopulatedDatabaseAnswer | null> => {
  const result = await AnswerModel.findOne({ _id: answerID }).populate<{
    comments: DatabaseComment[];
  }>([{ path: 'comments', model: CommentModel }]);

  return result;
};

/**
 * Fetches and populates a chat document with its related messages and user details.
 *
 * @param {string} chatID - The ID of the chat to fetch.
 * @returns {Promise<Chat | null>} - The populated chat document, or an error if not found.
 * @throws {Error} - Throws an error if the chat document is not found.
 */
const populateChat = async (chatID: string): Promise<PopulatedDatabaseChat | null> => {
  const chatDoc = await ChatModel.findOne({ _id: chatID }).populate<{
    messages: DatabaseMessage[];
  }>([{ path: 'messages', model: MessageModel }]);

  if (!chatDoc) {
    throw new Error('Chat not found');
  }

  const messagesWithUser: Array<MessageInChat | null> = await Promise.all(
    chatDoc.messages.map(async (messageDoc: DatabaseMessage) => {
      if (!messageDoc) return null;

      let userDoc: DatabaseUser | null = null;

      if (messageDoc.msgFrom) {
        userDoc = await UserModel.findOne({ username: messageDoc.msgFrom });
      }

      return {
        _id: messageDoc._id,
        msg: messageDoc.msg,
        msgFrom: messageDoc.msgFrom,
        msgDateTime: messageDoc.msgDateTime,
        type: messageDoc.type,
        user: userDoc
          ? {
              _id: userDoc._id!,
              username: userDoc.username,
            }
          : null,
      };
    }),
  );

  // Filters out null values
  const enrichedMessages = messagesWithUser.filter(Boolean);
  const transformedChat: PopulatedDatabaseChat = {
    ...chatDoc.toObject(),
    messages: enrichedMessages as MessageInChat[],
  };

  return transformedChat;
};

const populateSprint = async (sprintId: string): Promise<PopulatedDatabaseSprint | null> => {
  const sprintDoc = await SprintModel.findOne({ _id: sprintId }).populate<{
    tasks: DatabaseTask[];
  }>([{ path: 'tasks', model: TaskModel }]);

  if (!sprintDoc) {
    throw new Error('Sprint not found');
  }

  const sprintTasks: Array<PopulatedDatabaseTask | null> = await Promise.all(
    sprintDoc.tasks.map(async (taskDoc: DatabaseTask) => {
      if (!taskDoc) return null;

      const newTaskDoc = await TaskModel.findOne({ _id: taskDoc._id })
        .populate<{
          dependentTasks: DatabaseTask[];
        }>([{ path: 'dependentTasks', model: TaskModel }])
        .populate<{
          prereqTasks: DatabaseTask[];
        }>([{ path: 'prereqTasks', model: TaskModel }])
        .populate<{
          relevantQuestions: DatabaseQuestion[];
        }>([{ path: 'relevantQuestions', model: QuestionModel }]);

      if (!newTaskDoc) return null;

      return {
        _id: newTaskDoc._id,
        assignedUser: newTaskDoc.assignedUser,
        description: newTaskDoc.description,
        name: newTaskDoc.name,
        sprint: newTaskDoc.sprint,
        status: newTaskDoc.status,
        dependentTasks: newTaskDoc.dependentTasks,
        prereqTasks: newTaskDoc.prereqTasks,
        project: newTaskDoc.project,
        priority: newTaskDoc.priority,
        taskPoints: newTaskDoc.taskPoints,
        relevantQuestions: newTaskDoc.relevantQuestions,
        createdAt: newTaskDoc.createdAt,
        updatedAt: newTaskDoc.updatedAt,
      };
    }),
  );

  // Filters out null values
  const enrichedTasks = sprintTasks.filter(Boolean);
  const transformedSprint: PopulatedDatabaseSprint = {
    ...(sprintDoc.toObject ? sprintDoc.toObject() : sprintDoc),
    tasks: enrichedTasks as PopulatedDatabaseTask[],
  };

  return transformedSprint;
};

const populateProject = async (projectId: string): Promise<PopulatedDatabaseProject | null> => {
  const projectDoc = await ProjectModel.findOne({ _id: projectId }).populate<{
    backlogTasks: DatabaseTask[];
  }>([{ path: 'backlogTasks', model: TaskModel }]);

  if (!projectDoc) {
    throw new Error('Project not found');
  }

  const newBacklog = await Promise.all(
    projectDoc.backlogTasks.map(async (taskDoc: DatabaseTask) => {
      if (!taskDoc) return null;

      const newTaskDoc = await TaskModel.findOne({ _id: taskDoc._id })
        .populate<{
          dependentTasks: DatabaseTask[];
        }>([{ path: 'dependentTasks', model: TaskModel }])
        .populate<{
          prereqTasks: DatabaseTask[];
        }>([{ path: 'prereqTasks', model: TaskModel }])
        .populate<{
          relevantQuestions: DatabaseQuestion[];
        }>([{ path: 'relevantQuestions', model: TaskModel }]);

      if (!newTaskDoc) return null;

      return {
        _id: newTaskDoc._id,
        assignedUser: newTaskDoc.assignedUser,
        description: newTaskDoc.description,
        name: newTaskDoc.name,
        sprint: newTaskDoc.sprint,
        status: newTaskDoc.status,
        dependentTasks: newTaskDoc.dependentTasks,
        prereqTasks: newTaskDoc.prereqTasks,
        project: newTaskDoc.project,
        priority: newTaskDoc.priority,
        taskPoints: newTaskDoc.taskPoints,
        relevantQuestions: newTaskDoc.relevantQuestions,
        createdAt: newTaskDoc.createdAt,
        updatedAt: newTaskDoc.updatedAt,
      };
    }),
  );

  const projectSprints: Array<PopulatedDatabaseSprint | null> = await Promise.all(
    projectDoc.sprints.map(async (sprintDoc: ObjectId) => {
      if (!sprintDoc) return null;

      const newSprintDoc = await populateSprint(sprintDoc.toString());

      if (!newSprintDoc) return null;

      return {
        _id: newSprintDoc._id,
        name: newSprintDoc.name,
        project: newSprintDoc.project,
        status: newSprintDoc.status,
        startDate: newSprintDoc.startDate,
        endDate: newSprintDoc.endDate,
        tasks: newSprintDoc.tasks,
      };
    }),
  );

  // Filters out null values
  const enriched = projectSprints.filter(Boolean);
  const transformedProject: PopulatedDatabaseProject = {
    ...(projectDoc.toObject ? projectDoc.toObject() : projectDoc),
    sprints: enriched as PopulatedDatabaseSprint[],
    backlogTasks: newBacklog as PopulatedDatabaseTask[],
  };

  return transformedProject;
};

/**
 * Fetches and populates a question, answer, or chat document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the document to fetch.
 * @param {'question' | 'answer' | 'chat'} type - Specifies the type of document to fetch.
 * @returns {Promise<QuestionResponse | AnswerResponse | ChatResponse | SprintResponse | ProjectResponse>} - A promise resolving to the populated document or an error message if the operation fails.
 */
// eslint-disable is for testing purposes only, so that Jest spy functions can be used.
// eslint-disable-next-line import/prefer-default-export
export const populateDocument = async (
  id: string,
  type: 'question' | 'answer' | 'chat' | 'sprint' | 'project',
): Promise<
  | PopulatedDatabaseAnswer
  | PopulatedDatabaseChat
  | PopulatedDatabaseQuestion
  | PopulatedDatabaseSprint
  | PopulatedDatabaseProject
  | { error: string }
> => {
  try {
    if (!id) {
      throw new Error('Provided ID is undefined.');
    }

    let result = null;

    switch (type) {
      case 'question':
        result = await populateQuestion(id);
        break;
      case 'answer':
        result = await populateAnswer(id);
        break;
      case 'chat':
        result = await populateChat(id);
        break;
      case 'sprint':
        result = await populateSprint(id);
        break;
      case 'project':
        result = await populateProject(id);
        break;
      default:
        throw new Error('Invalid type provided.');
    }

    if (!result) {
      throw new Error(`Failed to fetch and populate ${type} with ID: ${id}`);
    }

    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};
