import { Project, SafeDatabaseUser } from '@fake-stack-overflow/shared';
import { Button, Form } from 'react-bootstrap';
import useUserContext from '../../../../hooks/useUserContext';

export default function CreateProjectForm({
  newProject,
  setNewProject,
  userList,
  handleCreateProject,
}: {
  newProject: Project;
  setNewProject: (proj: Project) => void;
  userList: SafeDatabaseUser[];
  handleCreateProject: (proj: Project) => void;
}) {
  const { user: currentUser } = useUserContext();

  return (
    <div className='p-3 d-flex flex-column justify-content-center align-items-center'>
      <h2 className='fw-bold'>Create Project</h2>
      <p className='text-muted'>
        Please create a project to start sprint planning and gain access to a Kanban Board and
        Project Roadmap to examine dependencies.
      </p>
      <Form className='mt-3'>
        <Form.Group controlId='projectName'>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Project Name'
            value={newProject.name}
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId='projectDescription'>
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Project Description'
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId='projectMembers'>
          <Form.Label>Project Members</Form.Label>
          <Form.Select
            multiple
            defaultValue={currentUser ? [currentUser.username] : []}
            onChange={e =>
              setNewProject({
                ...newProject,
                assignedUsers: Array.from(e.target.selectedOptions, option => option.value),
              })
            }>
            {userList.map(user => (
              <option key={user._id.toString()} value={user.username}>
                {user.username}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button className='mt-3' variant='success' onClick={() => handleCreateProject(newProject)}>
          Create Project
        </Button>
      </Form>
    </div>
  );
}
