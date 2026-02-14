  import React, { useState, useEffect } from 'react';
  import '../styles/taskModal.css';

  const TaskModal = ({ isOpen, task, onClose, onSave, teams = [], clients = [] }) => {
    const [formData, setFormData] = useState(task || {
      task: '',
      description: '',
      assignedTo: '',
      status: 'Not started',
      client: '',
      deadline: '',
      priority: 'Medium',
      tags: '',
      remarks: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
      if (task) {
        setFormData(task);
      } else {
        setFormData({
          task: '',
          description: '',
          assignedTo: '',
          status: 'Not Started',
          client: '',
          deadline: '',
          priority: 'Medium',
          tags: '',
          remarks: ''
        });
      }
      setErrors({});
    }, [isOpen, task]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.task || !formData.task.trim()) newErrors.task = 'Task name is required';
      if (!formData.assignedTo) newErrors.assignedTo = 'Assigned To is required';
      if (!formData.client) newErrors.client = 'Client is required';
      if (!formData.deadline) newErrors.deadline = 'Deadline is required';
      return newErrors;
    };

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMu_w9F4L38l_Xk1YnqUtX6jHLtIEFP13W4EMDpwkwvYAYMY2SV5IkvxhjzV4kuSrSSg/exec";

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formData),
    });

    alert("Task added to sheet!");
    onSave(formData);
    onClose();

  } catch (err) {
    console.error(err);
    alert("Failed to send data to sheet");
  }
};

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal modal-large" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
            <button className="btn-close" onClick={onClose}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            {/* Task Name */}
            <div className="form-group">
              <label htmlFor="task">Task Name *</label>
              <input
                type="text"
                id="task"
                name="task"
                placeholder="Enter task name"
                value={formData.task}
                onChange={handleChange}
                className={errors.task ? 'input-error' : ''}
                required
              />
              {errors.task && <span className="error-text">{errors.task}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            {/* Row: Assigned To & Client */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To *</label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={errors.assignedTo ? 'input-error' : ''}
                  required
                >
                  <option value="">-- Select Team Member --</option>
                  {teams && teams.length > 0 && teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                {errors.assignedTo && <span className="error-text">{errors.assignedTo}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="client">Client *</label>
                <select
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className={errors.client ? 'input-error' : ''}
                  required
                >
                  <option value="">-- Select Client --</option>
                  {clients && clients.length > 0 && clients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                {errors.client && <span className="error-text">{errors.client}</span>}
              </div>
            </div>

            {/* Row: Status & Priority */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="Not Started">Not started</option>
                  <option value="Pending">Pending</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select 
                  id="priority" 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="form-group">
              <label htmlFor="deadline">Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={errors.deadline ? 'input-error' : ''}
                required
              />
              {errors.deadline && <span className="error-text">{errors.deadline}</span>}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="e.g., design, frontend, urgent"
                value={formData.tags}
                onChange={handleChange}
              />
              <small>Enter tags separated by commas</small>
            </div>

            {/* Remarks */}
            <div className="form-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Additional notes or comments"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default TaskModal;
