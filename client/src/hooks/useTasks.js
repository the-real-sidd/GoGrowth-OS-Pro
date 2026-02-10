import { useState, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    assignedTo: 'all',
    status: 'all',
    client: 'all',
    search: '',
    dateRange: 'all',
    dateFrom: null,
    dateTo: null
  });

  const loadTasks = useCallback(async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await taskAPI.getAllTasks(filterParams);
      setTasks(response.data);
      applyFilters(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = (tasksToFilter) => {
    let filtered = tasksToFilter;

    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.client !== 'all') {
      filtered = filtered.filter(t => t.client === filters.client);
    }
    if (filters.search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const createTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([...tasks, response.data]);
      applyFilters([...tasks, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskAPI.updateTask(id, taskData);
      const updatedTasks = tasks.map(t => t._id === id ? response.data : t);
      setTasks(updatedTasks);
      applyFilters(updatedTasks);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      const updatedTasks = tasks.filter(t => t._id !== id);
      setTasks(updatedTasks);
      applyFilters(updatedTasks);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    applyFilters(tasks);
  };

  return {
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
  };
};
