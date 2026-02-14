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

      <div className="filter-group">
        <label htmlFor="dateRange">Date Range</label>
        <select 
          id="dateRange" 
          name="dateRange"
          value={filters.dateRange || 'all'}
          onChange={handleInputChange}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {filters.dateRange === 'custom' && (
        <>
          <div className="filter-group">
            <label htmlFor="dateFrom">From Date</label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="dateTo">To Date</label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo || ''}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select 
          id="sort" 
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleInputChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="deadline-asc">Deadline (Earliest)</option>
          <option value="deadline-desc">Deadline (Latest)</option>
          <option value="priority">Priority (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
