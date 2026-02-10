import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CONFIG from './config';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
// import Login from './pages/Login';  // TODO: Uncomment when DB is ready
import Notification from './components/Notification';
import Loader from './components/Loader';
// import { useAuth } from './hooks/useAuth';  // TODO: Uncomment when DB is ready
import './App.css';

function App() {
  // const { user, login, logout, getCurrentUser } = useAuth();  // TODO: Uncomment when DB is ready
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Mock user - TODO: Replace with real auth when database is ready
  const user = {
    name: 'Demo User',
    email: 'demo@gogrowth.com',
    role: CONFIG.USER_ROLES['demo@gogrowth.com'] || 'member'
  };

  useEffect(() => {
    // checkAuth();  // TODO: Uncomment when DB is ready
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // const checkAuth = async () => {  // TODO: Uncomment when DB is ready
  //   try {
  //     const userData = localStorage.getItem('user');
  //     if (userData) {
  //       getCurrentUser();
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = () => {
    // logout();  // TODO: Uncomment when DB is ready
    showNotification('Logged out successfully', 'success');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  if (loading) {
    return <Loader isVisible={true} />;
  }

  // Bypass login for now - TODO: Uncomment when DB is ready
  // if (!user) {
  //   return <Login onLoginSuccess={() => setLoading(false)} />;
  // }

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Loader isVisible={loading} />
        
        <Header
          currentUser={user}
          onLogout={handleLogout}
          onAddTask={() => setShowAddTaskModal(true)}
          darkMode={darkMode}
          onThemeChange={() => setDarkMode(!darkMode)}
        />

        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
