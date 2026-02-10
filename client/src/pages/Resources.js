import React, { useEffect, useState } from 'react';
import { useResources } from '../hooks/useResources';
import '../styles/resources.css';

const Resources = () => {
  const { resources, loading, error, loadResources, createResource, updateResource, deleteResource } = useResources();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all'
  });

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleSaveResource = async (resourceData) => {
    try {
      if (selectedResource) {
        await updateResource(selectedResource._id, resourceData);
      } else {
        await createResource(resourceData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteResource(id);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const getCategories = () => Array.from(new Set(resources.map(r => r.category)));
  const getTypes = () => Array.from(new Set(resources.map(r => r.type)));

  const filteredResources = resources.filter(r => {
    if (filters.category !== 'all' && r.category !== filters.category) return false;
    if (filters.type !== 'all' && r.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h2>Resources</h2>
        <button className="btn btn-primary" onClick={handleAddResource}>
          + Add Resource
        </button>
      </div>

      <div className="resources-filters">
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="all">All Categories</option>
          {getCategories().map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select 
          value={filters.type} 
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="all">All Types</option>
          {getTypes().map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="resources-grid">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : filteredResources.length === 0 ? (
          <p className="empty-state">No resources found</p>
        ) : (
          filteredResources.map(resource => (
            <div key={resource._id} className="resource-card">
              <h3>{resource.title}</h3>
              <p className="category">{resource.category}</p>
              <p className="description">{resource.description}</p>
              <p className="type">{resource.type}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                Visit
              </a>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => handleEditResource(resource)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteResource(resource._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;
