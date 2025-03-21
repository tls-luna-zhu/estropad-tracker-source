import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the Notification type
export type NotificationSetting = {
  id: string;
  enabled: boolean;
  reminderHours: number;
  emailEnabled: boolean;
  browserEnabled: boolean;
  customMessage?: string;
};

// Define the NotificationsContext type
type NotificationsContextType = {
  settings: NotificationSetting;
  updateSettings: (settings: Partial<NotificationSetting>) => void;
  sendTestNotification: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  hasNotificationPermission: boolean;
};

// Create the NotificationsContext
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Default notification settings
const defaultSettings: NotificationSetting = {
  id: 'default',
  enabled: true,
  reminderHours: 24,
  emailEnabled: false,
  browserEnabled: true,
  customMessage: 'Time to replace your estrogen pad!'
};

// Notifications Provider component
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSetting>(defaultSettings);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  // Load settings from localStorage on initial load
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('notificationSettings');
        
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
        
        // Check if we have notification permission
        if ('Notification' in window) {
          setHasNotificationPermission(Notification.permission === 'granted');
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Update notification settings
  const updateSettings = (newSettings: Partial<NotificationSetting>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Request notification permission
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasNotificationPermission(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasNotificationPermission(granted);
      return granted;
    }

    return false;
  };

  // Send a test notification
  const sendTestNotification = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    if (Notification.permission !== 'granted') {
      requestNotificationPermission();
      return;
    }

    const notification = new Notification('Luna\'s EstroPad Tracker', {
      body: settings.customMessage || 'This is a test notification!',
      icon: '/favicon.svg'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        settings,
        updateSettings,
        sendTestNotification,
        requestNotificationPermission,
        hasNotificationPermission
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Custom hook to use the notifications context
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
