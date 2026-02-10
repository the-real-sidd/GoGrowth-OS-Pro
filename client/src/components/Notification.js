import React from 'react';
import '../styles/notification.css';

const Notification = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button className="btn-close-notification" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;
