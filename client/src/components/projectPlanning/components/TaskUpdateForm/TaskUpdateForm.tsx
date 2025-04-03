/* eslint-disable @typescript-eslint/no-explicit-any */
import { PopulatedDatabaseProject, PopulatedDatabaseQuestion } from '@fake-stack-overflow/shared';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useQuestionPage from '../../../../hooks/useQuestionPage';
import { DatabaseClientTask } from '../../../../types/clientTypes/task';

export default function TaskUpdateForm({
  taskToUpdate,
  setTaskToUpdate,
}: {
  taskToUpdate: DatabaseClientTask;
  setTaskToUpdate: (task: DatabaseClientTask) => void;
}) {
  const { selectedTask }: { selectedTask: DatabaseClientTask } = useSelector(
    (state: any) => state.selectTaskReducer,
  );

  const { project }: { project: PopulatedDatabaseProject } = useSelector(
    (state: any) => state.projectReducer,
  );

  const { qlist } = useQuestionPage();

  useEffect(() => {
    setTaskToUpdate({ ...selectedTask });
  }, [selectedTask, setTaskToUpdate]);

  return (
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
          value={taskToUpdate.sprint ? taskToUpdate.sprint : undefined}
          onChange={e =>
            setTaskToUpdate({
              ...taskToUpdate,
              sprint: e.target.value ? e.target.value : null,
            })
          }>
          <option value=''>Backlog</option>
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
          value={
            taskToUpdate.relevantQuestions
              ? taskToUpdate.relevantQuestions.map(q => q._id.toString())
              : []
          }
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
              ).filter((question): question is PopulatedDatabaseQuestion => question !== null),
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
          value={
            taskToUpdate.prereqTasks
              ? taskToUpdate.prereqTasks.map(task => task._id.toString())
              : []
          }
          onChange={e =>
            setTaskToUpdate({
              ...taskToUpdate,
              prereqTasks: Array.from(
                e.target.selectedOptions,
                option =>
                  [
                    ...project.sprints.flatMap(sprint => sprint.tasks),
                    ...project.backlogTasks,
                  ].find(task => task._id.toString() === option.value) || null,
              ).filter(foundTask => foundTask !== null),
            })
          }>
          {project.sprints.map(sprint =>
            sprint.tasks.map(task => (
              <option key={task._id.toString()} value={task._id}>
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
          value={
            taskToUpdate.dependentTasks
              ? taskToUpdate.dependentTasks.map(task => task._id.toString())
              : []
          }
          onChange={e =>
            setTaskToUpdate({
              ...taskToUpdate,
              dependentTasks: Array.from(
                e.target.selectedOptions,
                option =>
                  [
                    ...project.sprints.flatMap(sprint => sprint.tasks),
                    ...project.backlogTasks,
                  ].find(task => task._id.toString() === option.value) || null,
              ).filter(foundTask => foundTask !== null),
            })
          }>
          {project.sprints.map(sprint =>
            sprint.tasks.map(task => (
              <option key={task._id.toString()} value={task._id}>
                {task.name}
              </option>
            )),
          )}
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
