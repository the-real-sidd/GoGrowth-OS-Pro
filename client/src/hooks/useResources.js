import { useState, useCallback } from 'react';
import { resourceAPI } from '../services/api';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadResources = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await resourceAPI.getAllResources(filters);
      setResources(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createResource = async (resourceData) => {
    try {
      const response = await resourceAPI.createResource(resourceData);
      setResources([...resources, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateResource = async (id, resourceData) => {
    try {
      const response = await resourceAPI.updateResource(id, resourceData);
      const updatedResources = resources.map(r => r._id === id ? response.data : r);
      setResources(updatedResources);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteResource = async (id) => {
    try {
      await resourceAPI.deleteResource(id);
      const updatedResources = resources.filter(r => r._id !== id);
      setResources(updatedResources);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    resources,
    loading,
    error,
    loadResources,
    createResource,
    updateResource,
    deleteResource
  };
};
