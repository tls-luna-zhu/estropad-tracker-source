"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="bg-[var(--primary)] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold pixel-text">Luna's EstroPad Tracker</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="pixel-heart mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold mb-2 pixel-text">Luna's EstroPad Tracker</h2>
            <p className="text-lg">Track your estrogen pad usage and get timely reminders</p>
          </div>
          
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <button 
              className="text-[var(--primary-dark)] hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-[var(--primary-dark)] text-white p-4 text-center">
        <p>Luna's EstroPad Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
