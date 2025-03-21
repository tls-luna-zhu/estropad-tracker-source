"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

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
            <h2 className="text-3xl font-bold mb-2 pixel-text">Create Account</h2>
            <p className="text-lg">Join Luna's EstroPad Tracker</p>
          </div>
          
          <RegisterForm />
          
          <div className="mt-6 text-center">
            <a href="/" className="text-[var(--primary-dark)] hover:underline">
              Back to Home
            </a>
          </div>
        </div>
      </main>
      
      <footer className="bg-[var(--primary-dark)] text-white p-4 text-center">
        <p>Luna's EstroPad Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
