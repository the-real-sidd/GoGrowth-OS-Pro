import React from 'react';
import '../styles/filters.css';

const TaskFilters = ({ filters, teams, clients, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleInputChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="assignedTo">Assigned To</label>
        <select 
          id="assignedTo" 
          name="assignedTo"
          value={filters.assignedTo}
          onChange={handleInputChange}
        >
          <option value="all">All</option>
          {teams && teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select 
          id="status" 
          name="status"
          value={filters.status}
          onChange={handleInputChange}
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="In progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="client">Client</label>
        <select 
          id="client" 
          name="client"
          value={filters.client}
          onChange={handleInputChange}
        >
          <option value="all">All</option>
          {clients && clients.map(client => (
            <option key={client} value={client}>{client}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
