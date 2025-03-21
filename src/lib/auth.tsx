"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Define the User type
type User = {
  id: string;
  email: string;
  name: string;
};

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // In a real app, this would verify the session with the server
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore authentication state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to register
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
