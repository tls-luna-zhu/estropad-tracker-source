"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AuthGuard from '@/components/auth/AuthGuard';
import Dashboard from '@/components/dashboard/Dashboard';
import AddPadForm from '@/components/tracking/AddPadForm';
import PadList from '@/components/tracking/PadList';
import InventoryManager from '@/components/inventory/InventoryManager';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationService from '@/components/notifications/NotificationService';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold pixel-text">Luna's EstroPad Tracker</h1>
            <div className="flex items-center space-x-4">
              <span>Hi, {user?.name || 'User'}</span>
              <button 
                onClick={handleLogout}
                className="pixel-button-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <nav className="bg-[var(--primary-light)] text-white p-2 overflow-x-auto whitespace-nowrap">
          <div className="container mx-auto flex space-x-2">
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary)]/50'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'add-pad' ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary)]/50'}`}
              onClick={() => setActiveTab('add-pad')}
            >
              Add Pad
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'pad-list' ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary)]/50'}`}
              onClick={() => setActiveTab('pad-list')}
            >
              Pad History
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'inventory' ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary)]/50'}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'notifications' ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary)]/50'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
        </nav>
        
        <main className="flex-grow container mx-auto p-4">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'add-pad' && <AddPadForm />}
          {activeTab === 'pad-list' && <PadList />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </main>
        
        <footer className="bg-[var(--primary-dark)] text-white p-4 text-center">
          <p>Luna's EstroPad Tracker &copy; {new Date().getFullYear()}</p>
        </footer>
        
        {/* Notification service doesn't render anything but handles notifications */}
        <NotificationService />
      </div>
    </AuthGuard>
  );
}
