import { useState } from 'react';
import { useNotifications } from '@/lib/notifications';

export default function NotificationSettings() {
  const { 
    settings, 
    updateSettings, 
    sendTestNotification,
    requestNotificationPermission,
    hasNotificationPermission
  } = useNotifications();
  
  const [customMessage, setCustomMessage] = useState(settings.customMessage || '');
  const [reminderHours, setReminderHours] = useState(settings.reminderHours);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSettings({
      customMessage,
      reminderHours
    });
    
    setSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  const handleToggleNotifications = () => {
    updateSettings({ enabled: !settings.enabled });
  };
  
  const handleToggleBrowserNotifications = async () => {
    if (!settings.browserEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSettings({ browserEnabled: true });
      }
    } else {
      updateSettings({ browserEnabled: false });
    }
  };
  
  const handleToggleEmailNotifications = () => {
    updateSettings({ emailEnabled: !settings.emailEnabled });
  };

  return (
    <div className="pixel-card">
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
      
      {success && (
        <div className="bg-[var(--success)] p-3 mb-4 text-white">
          Settings saved successfully!
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold">Enable Notifications</span>
          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
              checked={settings.enabled}
              onChange={handleToggleNotifications}
            />
            <span className={`absolute cursor-pointer inset-0 ${settings.enabled ? 'bg-[var(--primary)]' : 'bg-gray-300'} transition-colors duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-transform before:duration-200 before:rounded-full ${settings.enabled ? 'before:translate-x-6' : ''}`}></span>
          </label>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold">Browser Notifications</span>
          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
              checked={settings.browserEnabled}
              onChange={handleToggleBrowserNotifications}
              disabled={!settings.enabled}
            />
            <span className={`absolute cursor-pointer inset-0 ${settings.browserEnabled && settings.enabled ? 'bg-[var(--primary)]' : 'bg-gray-300'} transition-colors duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-transform before:duration-200 before:rounded-full ${settings.browserEnabled ? 'before:translate-x-6' : ''}`}></span>
          </label>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold">Email Notifications</span>
          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
              checked={settings.emailEnabled}
              onChange={handleToggleEmailNotifications}
              disabled={!settings.enabled}
            />
            <span className={`absolute cursor-pointer inset-0 ${settings.emailEnabled && settings.enabled ? 'bg-[var(--primary)]' : 'bg-gray-300'} transition-colors duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-transform before:duration-200 before:rounded-full ${settings.emailEnabled ? 'before:translate-x-6' : ''}`}></span>
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reminderHours" className="block mb-2 font-bold">
            Reminder Hours Before Replacement
          </label>
          <input
            id="reminderHours"
            type="number"
            min="1"
            max="72"
            className="pixel-input w-full"
            value={reminderHours}
            onChange={(e) => setReminderHours(parseInt(e.target.value))}
            required
            disabled={!settings.enabled}
          />
          <p className="text-sm mt-1">
            You'll be notified this many hours before your pad needs replacement
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="customMessage" className="block mb-2 font-bold">
            Custom Notification Message
          </label>
          <textarea
            id="customMessage"
            className="pixel-input w-full h-24"
            placeholder="Time to replace your estrogen pad!"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            disabled={!settings.enabled}
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="pixel-button flex-1"
            disabled={!settings.enabled}
          >
            Save Settings
          </button>
          
          <button
            type="button"
            className="pixel-button flex-1"
            onClick={sendTestNotification}
            disabled={!settings.enabled || !settings.browserEnabled || !hasNotificationPermission}
          >
            Test Notification
          </button>
        </div>
        
        {settings.browserEnabled && !hasNotificationPermission && (
          <div className="mt-4 bg-[var(--warning)] p-3 text-white">
            Please allow notifications in your browser to receive alerts.
          </div>
        )}
      </form>
    </div>
  );
}
