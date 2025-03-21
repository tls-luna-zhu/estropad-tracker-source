import { useEffect } from 'react';
import { usePadTracker } from '@/lib/padTracker';
import { useNotifications } from '@/lib/notifications';

export default function NotificationService() {
  const { pads, inventory, getNextReplacementDate, isInventoryLow } = usePadTracker();
  const { settings, hasNotificationPermission } = useNotifications();

  // Check for pads that need replacement
  useEffect(() => {
    if (!settings.enabled || !settings.browserEnabled || !hasNotificationPermission) {
      return;
    }

    const checkReplacements = () => {
      const nextReplacementDate = getNextReplacementDate();
      
      if (!nextReplacementDate) return;
      
      const replacementTime = new Date(nextReplacementDate).getTime();
      const currentTime = new Date().getTime();
      const reminderTime = settings.reminderHours * 60 * 60 * 1000; // Convert hours to milliseconds
      
      // If it's time to notify (within the reminder window)
      if (replacementTime - currentTime <= reminderTime && replacementTime > currentTime) {
        const hoursRemaining = Math.ceil((replacementTime - currentTime) / (1000 * 60 * 60));
        
        const notification = new Notification('Luna\'s EstroPad Tracker', {
          body: settings.customMessage || `Time to replace your estrogen pad in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}!`,
          icon: '/favicon.svg'
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    };
    
    // Check immediately on mount
    checkReplacements();
    
    // Then check every hour
    const interval = setInterval(checkReplacements, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [pads, settings, hasNotificationPermission, getNextReplacementDate]);
  
  // Check for low inventory
  useEffect(() => {
    if (!settings.enabled || !settings.browserEnabled || !hasNotificationPermission) {
      return;
    }
    
    if (isInventoryLow()) {
      const notification = new Notification('Luna\'s EstroPad Tracker', {
        body: 'Your estrogen pad inventory is running low! Time to restock.',
        icon: '/favicon.svg'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, [inventory, settings, hasNotificationPermission, isInventoryLow]);
  
  // This is a service component that doesn't render anything
  return null;
}
