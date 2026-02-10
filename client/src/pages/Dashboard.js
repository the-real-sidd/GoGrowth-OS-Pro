import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import Statistics from '../components/Statistics';
import { useTasks } from '../hooks/useTasks';
import '../styles/dashboard.css';

const Dashboard = () => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In progress').length,
      pending: tasks.filter(t => t.status === 'Pending').length
    };
    setStats(stats);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsModalOpen(false);
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
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
