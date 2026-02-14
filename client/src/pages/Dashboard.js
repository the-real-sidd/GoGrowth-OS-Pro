import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import Statistics from '../components/Statistics';
import { useTasks } from '../hooks/useTasks';
import '../styles/dashboard.css';

const Dashboard = ({ isAddTaskModalOpen, selectedTaskForEdit, onCloseModal }) => {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    updateFilters
  } = useTasks();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    calculateStats();
  }, [filteredTasks]);

  const calculateStats = () => {
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status && t.status.toLowerCase() === 'completed').length,
      inProgress: tasks.filter(t => t.status && t.status.toLowerCase() === 'in progress').length,
      pending: tasks.filter(t => t.status && (t.status.toLowerCase() === 'pending' || t.status.toLowerCase() === 'not started')).length
    };
    setStats(stats);
  };

  const handleEditTask = (task) => {
    // Note: Edit functionality would need App state management to be fully implemented
    // For now, just open the modal and set the task in local edit mode
    return;
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTaskForEdit) {
        await updateTask(selectedTaskForEdit._id, taskData);
      } else {
        await createTask(taskData);
      }
      onCloseModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getUniqueClis = () => Array.from(new Set(tasks.map(t => t.client)));
  const getUniqueTeams = () => Array.from(new Set(tasks.map(t => t.assignedTo)));

  return (
    <div className="dashboard-page">
      <Statistics stats={stats} />

      <div className="dashboard-content">
        <TaskFilters
          filters={filters}
          teams={getUniqueTeams()}
          clients={getUniqueClis()}
          onFilterChange={updateFilters}
        />

        <div className="tasks-view">
          <div className="tasks-list">
            {loading ? (
              <p>Loading tasks...</p>
            ) : error ? (
              <p className="error">Error: {error}</p>
            ) : filteredTasks.length === 0 ? (
              <p className="empty-state">No tasks found</p>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isAddTaskModalOpen}
        task={selectedTaskForEdit}
        onClose={onCloseModal}
        onSave={handleSaveTask}
        teams={getUniqueTeams()}
        clients={getUniqueClis()}
      />
    </div>
  );
};

export default Dashboard;
