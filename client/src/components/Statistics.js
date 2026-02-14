import React from 'react';
import '../styles/statistics.css';

const Statistics = ({ stats }) => {
  return (
    <div className="stats-header">
      <h2>Overview</h2>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value" id="stat-total">{stats.total || 0}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success" id="stat-completed">{stats.completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-primary" id="stat-progress">{stats.inProgress || 0}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-secondary" id="stat-pending">{stats.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
