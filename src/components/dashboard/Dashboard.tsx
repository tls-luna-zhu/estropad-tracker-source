import { useAuth } from '@/lib/auth';
import { usePadTracker } from '@/lib/padTracker';
import { useNotifications } from '@/lib/notifications';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const { getActivePad, getNextReplacementDate, isInventoryLow, inventory } = usePadTracker();
  const { settings, requestNotificationPermission, hasNotificationPermission } = useNotifications();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No active pads';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (dateString: string | null) => {
    if (!dateString) return null;
    
    const now = new Date();
    const target = new Date(dateString);
    const diffTime = target.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Overdue!';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
  };
  
  // Check if we should prompt for notification permission
  useEffect(() => {
    if (settings.enabled && settings.browserEnabled && !hasNotificationPermission) {
      setShowPermissionPrompt(true);
    } else {
      setShowPermissionPrompt(false);
    }
  }, [settings.enabled, settings.browserEnabled, hasNotificationPermission]);
  
  // Handle requesting permission
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowPermissionPrompt(false);
    }
  };
  
  const activePad = getActivePad();
  const nextReplacement = getNextReplacementDate();
  const lowInventory = isInventoryLow();

  return (
    <div className="space-y-6">
      <div className="pixel-card">
        <h2 className="text-xl font-bold mb-4">Welcome, {user?.name || 'User'}!</h2>
        <p>Luna's EstroPad Tracker helps you manage your estrogen pad usage and inventory.</p>
      </div>
      
      {showPermissionPrompt && (
        <div className="pixel-card bg-[var(--warning)]/20 border-2 border-[var(--warning)]">
          <h3 className="font-bold mb-2">Enable Notifications</h3>
          <p className="mb-4">Allow browser notifications to receive alerts when it's time to replace your pads.</p>
          <button 
            className="pixel-button w-full"
            onClick={handleRequestPermission}
          >
            Allow Notifications
          </button>
        </div>
      )}
      
      <div className="pixel-card">
        <h3 className="font-bold mb-4">Pad Status</h3>
        
        {activePad ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Active Pad:</span>
              <span>{activePad.model}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Location:</span>
              <span>{activePad.location}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Applied:</span>
              <span>{formatDate(activePad.applicationDate)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Replace By:</span>
              <span>{formatDate(activePad.replacementDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Time Remaining:</span>
              <span className="font-bold text-[var(--primary)]">
                {getTimeRemaining(activePad.replacementDate)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center py-4">No active pads. Add your first pad to start tracking!</p>
        )}
      </div>
      
      <div className="pixel-card">
        <h3 className="font-bold mb-4">Inventory Status</h3>
        
        {inventory.length > 0 ? (
          <div>
            {lowInventory && (
              <div className="bg-[var(--warning)]/20 border-2 border-[var(--warning)] p-3 mb-4 rounded">
                <p className="font-bold">⚠️ Low Inventory Alert</p>
                <p>Some items are below your threshold. Time to restock!</p>
              </div>
            )}
            
            <div className="space-y-2">
              {inventory.map(item => (
                <div 
                  key={item.model}
                  className={`flex justify-between items-center p-2 rounded ${
                    item.count <= item.lowThreshold 
                      ? 'bg-[var(--warning)]/10' 
                      : 'bg-[var(--success)]/10'
                  }`}
                >
                  <span>{item.model}</span>
                  <span className="font-bold">{item.count} remaining</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center py-4">No inventory items added yet.</p>
        )}
      </div>
    </div>
  );
}
