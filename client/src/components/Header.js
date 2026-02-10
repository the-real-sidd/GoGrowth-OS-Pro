import React, { useState, useEffect } from 'react';
import '../styles/header.css';

const Header = ({ currentUser, onLogout, onAddTask, darkMode, onThemeChange }) => {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">GoGrowth OS</h1>
      </div>
      <div className="header-center">
        <nav className="main-nav">
          <button 
            className={`main-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveNav('dashboard')}
            data-page="dashboard"
          >
            Dashboard
          </button>
          <button 
            className={`main-nav-item ${activeNav === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveNav('resources')}
            data-page="resources"
          >
            Resources
          </button>
        </nav>
      </div>
      <div className="header-right">
        <button 
          id="theme-toggle" 
          className="btn-icon" 
          title="Toggle Dark/Light Mode"
          onClick={onThemeChange}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1.66667V3.33334M10 16.6667V18.3333M3.33333 10H1.66667M18.3333 10H16.6667M15.8333 4.16667L14.6417 5.35834M5.35833 14.6417L4.16667 15.8333M15.8333 15.8333L14.6417 14.6417M5.35833 5.35834L4.16667 4.16667M13.3333 10C13.3333 11.8409 11.8409 13.3333 10 13.3333C8.15905 13.3333 6.66667 11.8409 6.66667 10C6.66667 8.15906 8.15905 6.66667 10 6.66667C11.8409 6.66667 13.3333 8.15906 13.3333 10Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button id="btn-add-task" className="btn btn-primary" onClick={onAddTask}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="btn-text">Add Task</span>
        </button>
        {currentUser && (
          <div className="user-profile">
            <span className="user-name">{currentUser.name}</span>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
