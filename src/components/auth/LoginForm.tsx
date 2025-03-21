import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Luna's EstroPad Tracker</h2>
      
      {error && (
        <div className="bg-[var(--error)] p-3 mb-4 text-white">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="mb-6">
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
          />
        </div>
        
        <button
          type="submit"
          className="pixel-button w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>Don't have an account? <a href="/register" className="text-[var(--primary-dark)] hover:underline">Register</a></p>
      </div>
    </div>
  );
}
