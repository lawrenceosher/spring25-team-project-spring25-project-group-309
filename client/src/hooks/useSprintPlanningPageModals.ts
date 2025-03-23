import { useState } from 'react';

const useSprintPlanningPageModals = () => {
  // Task Creation Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const handleCloseCreateTaskModal = () => setShowCreateTaskModal(false);
  const handleShowCreateTaskModal = () => setShowCreateTaskModal(true);

  // Sprint Creation Modal
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const handleCloseCreateSprintModal = () => setShowCreateSprintModal(false);
  const handleShowCreateSprintModal = () => setShowCreateSprintModal(true);

  // Sprint Deletion Modal
  const [showDeleteSprintModal, setShowDeleteSprintModal] = useState(false);
  const handleCloseDeleteSprintModal = () => setShowDeleteSprintModal(false);
  const handleShowDeleteSprintModal = () => setShowDeleteSprintModal(true);

  // Task Deletion Modal
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const handleCloseDeleteTaskModal = () => setShowDeleteTaskModal(false);
  const handleShowDeleteTaskModal = () => setShowDeleteTaskModal(true);

  // Task Update Modal
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const handleCloseTaskUpdateModal = () => setShowTaskUpdateModal(false);
  const handleShowTaskUpdateModal = () => setShowTaskUpdateModal(true);

  // Task Update Modal
  const [showSprintUpdateModal, setShowSprintUpdateModal] = useState(false);
  const handleCloseSprintUpdateModal = () => setShowSprintUpdateModal(false);
  const handleShowSprintUpdateModal = () => setShowSprintUpdateModal(true);

  return {
    showCreateTaskModal,
    handleCloseCreateTaskModal,
    handleShowCreateTaskModal,
    showCreateSprintModal,
    handleCloseCreateSprintModal,
    handleShowCreateSprintModal,
    showDeleteSprintModal,
    handleCloseDeleteSprintModal,
    handleShowDeleteSprintModal,
    showDeleteTaskModal,
    handleCloseDeleteTaskModal,
    handleShowDeleteTaskModal,
    showTaskUpdateModal,
    handleCloseTaskUpdateModal,
    handleShowTaskUpdateModal,
    showSprintUpdateModal,
    handleCloseSprintUpdateModal,
    handleShowSprintUpdateModal,
  };
};

export default useSprintPlanningPageModals;
