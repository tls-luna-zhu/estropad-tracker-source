import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      
      {error && (
        <div className="bg-[var(--error)] p-3 mb-4 text-white">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="pixel-input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="pixel-input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="pixel-input w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="pixel-input w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="pixel-button w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>Already have an account? <a href="/login" className="text-[var(--primary-dark)] hover:underline">Login</a></p>
      </div>
    </div>
  );
}
