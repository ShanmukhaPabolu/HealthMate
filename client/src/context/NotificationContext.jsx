import React, { createContext, useState, useEffect, useContext } from 'react';
import { api, AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Fetch notifications periodically if logged in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        if (response.data.success) {
          setNotifications(response.data.data);
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Add toast alert message
  const triggerToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Mark single or all as read
  const markAsRead = async (id = null) => {
    try {
      const response = await api.patch('/notifications/read', { id });
      if (response.data.success) {
        if (id) {
          setNotifications(prev =>
            prev.map(n => (n._id === id ? { ...n, read: true } : n))
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        } else {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error('Failed to mark notification read', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        triggerToast,
        markAsRead
      }}
    >
      {children}
      
      {/* Toast container overlay */}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          top: '90px',
          right: '30px',
          zIndex: 100005,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-alert toast-${toast.type}`}
            style={{
              padding: '16px 24px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
              background: toast.type === 'error' ? 'var(--primary-gradient)' : toast.type === 'success' ? 'var(--accent-gradient)' : 'var(--secondary-gradient)'
            }}
          >
            <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : toast.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
