import React from 'react';
import '../styles/taskCard.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In progress':
        return 'status-progress';
      case 'Pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.task}</h3>
        <div className="task-actions">
          <button className="btn-icon-sm" onClick={() => onEdit(task)}>✏️</button>
          <button className="btn-icon-sm" onClick={() => onDelete(task._id)}>🗑️</button>
        </div>
      </div>

      <div className="task-meta">
        <span className={`status-badge ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {task.priority && (
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        )}
      </div>

      <div className="task-info">
        <div className="task-info-row">
          <span className="label">Client:</span>
          <span className="client-pill">{task.client}</span>
        </div>
        <div className="task-info-row">
          <span className="label">Assigned to:</span>
          <span>{task.assignedTo}</span>
        </div>
        <div className="task-info-row">
          <span className="label">Deadline:</span>
          <span>{formatDate(task.deadline)}</span>
        </div>
        {task.completedOn && (
          <div className="task-info-row">
            <span className="label">Completed:</span>
            <span>{formatDate(task.completedOn)}</span>
          </div>
        )}
        {task.remarks && (
          <div className="task-info-row">
            <span className="label">Remarks:</span>
            <span className="remarks">{task.remarks}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
