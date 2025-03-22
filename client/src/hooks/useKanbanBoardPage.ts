import { useState } from 'react';

const useKanbanBoardPage = () => {
  const progressColumns = ['To-Do', 'In Progress', 'Done'];

  // Create Task Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const handleCloseCreateTaskModal = () => setShowCreateTaskModal(false);
  const handleShowCreateTaskModal = () => setShowCreateTaskModal(true);

  // Complete Sprint Modal
  const [showCompleteSprintModal, setShowCompleteSprintModal] = useState(false);
  const handleCloseCompleteSprintModal = () => setShowCompleteSprintModal(false);
  const handleShowCompleteSprintModal = () => setShowCompleteSprintModal(true);

  return {
    progressColumns,
    showCreateTaskModal,
    handleCloseCreateTaskModal,
    handleShowCreateTaskModal,
    showCompleteSprintModal,
    handleCloseCompleteSprintModal,
    handleShowCompleteSprintModal,
  };
};

export default useKanbanBoardPage;
