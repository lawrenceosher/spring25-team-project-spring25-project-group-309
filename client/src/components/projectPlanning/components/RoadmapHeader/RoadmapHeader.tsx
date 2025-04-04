import { FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import { PopulatedDatabaseSprint, PopulatedDatabaseTask } from '@fake-stack-overflow/shared';

export default function RoadmapHeader({
  projectName,
  sprints,
  users,
  allTasks,
  setFilteredTasks,
}: {
  projectName: string;
  sprints: PopulatedDatabaseSprint[];
  users: string[];
  allTasks: PopulatedDatabaseTask[];
  setFilteredTasks: (tasks: PopulatedDatabaseTask[]) => void;
}) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(sprints) || !Array.isArray(users) || !Array.isArray(allTasks)) return [];

    let filtered = allTasks;

    if (selectedSprintId !== '') {
      const sprint = sprints.find(s => s._id.toString() === selectedSprintId);
      const sprintTaskIds = sprint?.tasks.map(t => t._id) ?? [];
      filtered = filtered.filter(task => sprintTaskIds.includes(task._id));
    }

    if (selectedUser !== '') {
      filtered = filtered.filter(task => task.assignedUser === selectedUser);
    }

    return filtered;
  }, [selectedSprintId, selectedUser, allTasks, sprints, users]);

  useEffect(() => {
    setFilteredTasks(filteredTasks);
  }, [filteredTasks, setFilteredTasks]);

  // Event handlers for filter changes (sprint and user)
  const handleSprintFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprintId(event.target.value);
  };

  const handleUserFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div id='roadmap-header' className='d-flex align-items-center mb-3'>
      <h1 id='roadmap-name-header' className='fw-bold d-flex'>
        {projectName} - Roadmap
      </h1>
      <div className='d-flex justify-content-end flex-grow-1'>
        <FormGroup className='d-inline-flex me-3 align-middle'>
          <div>
            <FormLabel>Filter by Sprint:</FormLabel>
            <FormSelect value={selectedSprintId} onChange={handleSprintFilterChange}>
              <option value=''>All</option>
              {(sprints ?? []).map(sprint => (
                <option key={sprint._id.toString()} value={sprint._id.toString()}>
                  {sprint.name}
                </option>
              ))}
            </FormSelect>
          </div>
        </FormGroup>

        <FormGroup className='d-inline-flex me-3 align-middle'>
          <div>
            <FormLabel>Filter by User:</FormLabel>
            <FormSelect value={selectedUser} onChange={handleUserFilterChange}>
              <option value=''>All</option>
              {(users ?? []).map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </FormSelect>
          </div>
        </FormGroup>
      </div>
    </div>
  );
}
