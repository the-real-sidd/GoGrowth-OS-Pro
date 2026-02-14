import { useState, useCallback, useEffect } from 'react';
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
    dateFrom: '',
    dateTo: '',
    sort: 'newest'
  });

  const getDate = (dateValue) => {
    if (!dateValue) return new Date(0);
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  const filterByDateRange = (tasksToFilter, dateRange, dateFrom, dateTo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasksToFilter.filter(task => {
      const taskDate = getDate(task.deadline || task.createdAt);
      
      switch (dateRange) {
        case 'today':
          return taskDate.getTime() === today.getTime();
        
        case 'this-week': {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        }
        
        case 'this-month':
          return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
        
        case 'last-7-days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return taskDate >= sevenDaysAgo && taskDate <= today;
        }
        
        case 'last-30-days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return taskDate >= thirtyDaysAgo && taskDate <= today;
        }
        
        case 'custom': {
          if (dateFrom && dateTo) {
            const fromDate = getDate(dateFrom);
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            return taskDate >= fromDate && taskDate <= toDate;
          }
          return true;
        }
        
        default:
          return true;
      }
    });
  };

  const applySorting = (tasksToSort, sortType) => {
    const sorted = [...tasksToSort];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = getDate(a.createdAt);
          const dateB = getDate(b.createdAt);
          return dateB - dateA;
        });
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = getDate(a.createdAt);
          const dateB = getDate(b.createdAt);
          return dateA - dateB;
        });
      case 'deadline-asc':
        return sorted.sort((a, b) => {
          const dateA = getDate(a.deadline);
          const dateB = getDate(b.deadline);
          return dateA - dateB;
        });
      case 'deadline-desc':
        return sorted.sort((a, b) => {
          const dateA = getDate(a.deadline);
          const dateB = getDate(b.deadline);
          return dateB - dateA;
        });
      case 'priority':
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return sorted.sort((a, b) => (priorityOrder[a.priority?.toLowerCase()] || 99) - (priorityOrder[b.priority?.toLowerCase()] || 99));
      default:
        return sorted;
    }
  };

  const applyFilters = (tasksToFilter, currentFilters) => {
    let filtered = [...tasksToFilter];

    // Apply filter conditions
    if (currentFilters.assignedTo !== 'all') {
      filtered = filtered.filter(t => t.assignedTo === currentFilters.assignedTo);
    }
    if (currentFilters.status !== 'all') {
      filtered = filtered.filter(t => t.status && t.status.toLowerCase() === currentFilters.status.toLowerCase());
    }
    if (currentFilters.client !== 'all') {
      filtered = filtered.filter(t => t.client === currentFilters.client);
    }
    if (currentFilters.search) {
      filtered = filtered.filter(t =>
        (t.title && t.title.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
        (t.task && t.task.toLowerCase().includes(currentFilters.search.toLowerCase()))
      );
    }

    // Apply date range filter
    if (currentFilters.dateRange && currentFilters.dateRange !== 'all') {
      filtered = filterByDateRange(filtered, currentFilters.dateRange, currentFilters.dateFrom, currentFilters.dateTo);
    }

    // Apply sorting
    if (currentFilters.sort) {
      filtered = applySorting(filtered, currentFilters.sort);
    }

    setFilteredTasks(filtered);
  };

  // Apply filters and sorting whenever tasks or filters change
  useEffect(() => {
    applyFilters(tasks, filters);
  }, [tasks, filters]);

  const loadTasks = useCallback(async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await taskAPI.getAllTasks(filterParams);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([...tasks, response.data]);
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
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
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
